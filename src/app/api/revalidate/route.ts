import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath, revalidateTag } from 'next/cache';

export async function POST(req: NextRequest) {
  console.log('🔁 Revalidation POST request received');

  try {
    const body = await req.json();
    console.log('🔁 Request body:', body);

    const entry = body.entry;
    const slug = entry?.slug;
    const locale = entry?.locale;
    const secret = req.nextUrl.searchParams.get('secret'); // passed in webhook URL

    if (secret !== "1234") {
      console.warn('❌ Invalid secret');
      return NextResponse.json({ message: 'Invalid secret' }, { status: 401 });
    }

    if (!slug || !locale) {
      console.warn('❌ Missing slug or locale');
      return NextResponse.json({ message: 'Missing slug or locale' }, { status: 400 });
    }

    const tag = `page-${locale}-${slug}`;
    const path = `/${locale}/${slug}`;

    // Trigger both revalidations
    revalidateTag(tag);
    await revalidatePath(path);

    console.log(`✅ Revalidated path: ${path}`);
    console.log(`✅ Revalidated tag: ${tag}`);

    return NextResponse.json({ revalidated: true, path, tag });
  } catch (err) {
    console.error('❌ Revalidation error:', err);
    return NextResponse.json({ message: 'Error revalidating' }, { status: 500 });
  }
}
