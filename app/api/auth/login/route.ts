import { NextRequest, NextResponse } from 'next/server'; // Import Next.js server utility types
import { sql, queryOne } from '@/server/db/connection'; // Import database connection utilities
import { LoginInput, LoginSuccess, UserDTO } from '@/lib/types/userTypes'; // Import user-related types
import { getPublicError } from '@/lib/publicErrors'; // Import function to get public error messages

export async function POST(request: NextRequest) {
  try {
    const body: LoginInput = await request.json();

    // Validate input
    if (!body.email || !body.password) {
      return NextResponse.json(
        getPublicError('MISSING_REQUIRED_FIELD'),
        { status: 400 }
      );
    }

    // Find user by email
    const user = await queryOne<UserDTO & { passwordHash: string }>`
      SELECT 
        id,
        email,
        role,
        company_id as "companyId",
        password_hash as "passwordHash",
        created_at as "createdAt",
        created_at as "updatedAt"
      FROM users
      WHERE email = ${body.email}
    `;

    if (!user) {
      return NextResponse.json(
        getPublicError('INVALID_CREDENTIALS'),
        { status: 401 }
      );
    }

    // TODO: Add password hashing with bcrypt
    const isValidPassword = user.passwordHash === body.password;

    if (!isValidPassword) {
      return NextResponse.json(
        getPublicError('INVALID_CREDENTIALS'),
        { status: 401 }
      );
    }

    // TODO: Generate JWT token
    const token = `token_${user.id}_${Date.now()}`;

    const response: LoginSuccess = {
      token,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        companyId: user.companyId,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      },
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      getPublicError('SERVER_ERROR'),
      { status: 500 }
    );
  }
}
