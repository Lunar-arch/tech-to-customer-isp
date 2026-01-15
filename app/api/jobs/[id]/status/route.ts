import { NextRequest, NextResponse } from 'next/server';
import { sql, toCamelCase } from '@/server/db/connection';
import { JobDTO, JobStatus, UpdateJobStatusInput, UpdateJobStatusSuccess } from '@/lib/types/jobTypes';
import { getPublicError } from '@/lib/publicErrors';

// Update job status
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = (await request.json()) as Partial<UpdateJobStatusInput> & { notes?: string };

    const status = body.status;
    const completionNotes = body.completionNotes ?? body.notes;

    if (!status) {
      return NextResponse.json(
        getPublicError('MISSING_REQUIRED_FIELD'),
        { status: 400 }
      );
    }

    const validStatuses: JobStatus[] = ['unassigned', 'assigned', 'in_progress', 'completed', 'cancelled'];
    if (!validStatuses.includes(status)) {
      return NextResponse.json(
        { message: 'Invalid status', code: 'INVALID_INPUT' },
        { status: 400 }
      );
    }

    const updatedRows = await sql`
      UPDATE jobs
      SET 
        status = ${status},
        completion_notes = ${completionNotes ?? sql`completion_notes`},
        completed_at = ${status === 'completed' ? sql`NOW()` : sql`completed_at`}
      WHERE id = ${params.id}
      RETURNING 
        id,
        company_id,
        customer_name,
        address,
        phone,
        job_type,
        status,
        priority,
        assigned_tech_id,
        scheduled_time,
        created_at,
        completed_at,
        initial_notes,
        completion_notes
    `;

    if (updatedRows.length === 0) {
      return NextResponse.json(
        getPublicError('NOT_FOUND'),
        { status: 404 }
      );
    }

    const job = toCamelCase<JobDTO>(updatedRows[0] as Record<string, unknown>);
    const response: UpdateJobStatusSuccess = { success: true, updatedJob: job };
    return NextResponse.json(response);
  } catch (error) {
    console.error('Update status error:', error);
    return NextResponse.json(
      getPublicError('SERVER_ERROR'),
      { status: 500 }
    );
  }
}
