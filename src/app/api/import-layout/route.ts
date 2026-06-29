import { NextResponse } from 'next/server';

// Temporary in-memory storage for the latest imported layout
// In a production app, this would save to a PostgreSQL database.
let latestImportedLayout: any = null;

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // Simple schema validation
    if (!body.id || !body.sections) {
      return NextResponse.json(
        { error: 'Invalid layout schema. Must contain id and sections.' },
        { status: 400 }
      );
    }

    latestImportedLayout = body;
    
    return NextResponse.json({
      success: true,
      message: 'Layout successfully imported from Figma!',
      layout: body
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || 'Failed to parse JSON body' },
      { status: 500 }
    );
  }
}

export async function GET() {
  // Allow the editor to poll for the latest imported layout if needed
  if (!latestImportedLayout) {
    return NextResponse.json({ layout: null });
  }
  
  const layout = latestImportedLayout;
  // Clear after reading to prevent infinite loops
  latestImportedLayout = null;
  
  return NextResponse.json({ layout });
}
