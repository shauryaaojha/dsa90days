import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import dbConnect from '@/lib/db';
import User from '@/models/User';

// In-memory cache for IP Rate Limiting (registration attempts)
// Allows up to 5 registration attempts per IP per hour.
const ipCache = new Map<string, { attempts: number; resetTime: number }>();

export async function POST(req: NextRequest) {
  try {
    // 1. IP Rate Limiting
    const ip = req.headers.get('x-forwarded-for') || '127.0.0.1';
    const now = Date.now();
    const cache = ipCache.get(ip);

    if (cache) {
      if (now < cache.resetTime) {
        if (cache.attempts >= 5) {
          return NextResponse.json(
            { error: 'Too many registration requests from this IP. Please try again after an hour.' },
            { status: 429 }
          );
        }
        cache.attempts += 1;
      } else {
        // Reset window
        ipCache.set(ip, { attempts: 1, resetTime: now + 3600000 });
      }
    } else {
      // Create window
      ipCache.set(ip, { attempts: 1, resetTime: now + 3600000 });
    }

    const { name, email, password, website, num1, num2, captchaAnswer } = await req.json();

    // 2. Honeypot Validation: If the hidden 'website' input was filled, it's a bot.
    // Return a fake successful response to fool the bot without adding anything to MongoDB.
    if (website) {
      console.log(`[Bot Prevention] Honeypot triggered by bot from IP: ${ip}`);
      return NextResponse.json(
        {
          message: 'User created successfully',
          user: { id: 'bot-prevention-success', name, email },
        },
        { status: 201 }
      );
    }

    // 3. CAPTCHA Math Verification
    if (
      num1 === undefined ||
      num2 === undefined ||
      captchaAnswer === undefined ||
      parseInt(num1) + parseInt(num2) !== parseInt(captchaAnswer)
    ) {
      return NextResponse.json(
        { error: 'Human verification failed. Please solve the math captcha correctly.' },
        { status: 400 }
      );
    }

    // 4. Input Validations
    if (!name || !email || !password) {
      return NextResponse.json(
        { error: 'Name, email, and password are required' },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: 'Password must be at least 6 characters' },
        { status: 400 }
      );
    }

    // 5. College/University Whitelist Domain Validation
    // Configurable via ALLOWED_EMAIL_DOMAINS in env (e.g. ALLOWED_EMAIL_DOMAINS=@college.edu,@iiit.ac.in)
    const allowedDomainsEnv = process.env.ALLOWED_EMAIL_DOMAINS;
    if (allowedDomainsEnv) {
      const allowedDomains = allowedDomainsEnv
        .split(',')
        .map(d => d.trim().toLowerCase());
      
      if (allowedDomains.length > 0) {
        const hasAllowedDomain = allowedDomains.some(domain => 
          email.toLowerCase().endsWith(domain)
        );
        
        if (!hasAllowedDomain) {
          return NextResponse.json(
            { 
              error: `Registration is restricted to college students. Please use your official email (Allowed domains: ${allowedDomainsEnv}).` 
            },
            { status: 403 }
          );
        }
      }
    }

    await dbConnect();

    // Check if user already exists
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return NextResponse.json(
        { error: 'User with this email already exists' },
        { status: 409 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create user
    const user = await User.create({
      name,
      email: email.toLowerCase(),
      password: hashedPassword,
    });

    return NextResponse.json(
      {
        message: 'User created successfully',
        user: { id: user._id, name: user.name, email: user.email },
      },
      { status: 201 }
    );
  } catch (error: unknown) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
