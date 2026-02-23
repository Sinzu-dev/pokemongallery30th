import { Suspense } from 'react';
import SubmitForm from '@/components/submit-form';

interface SubmitPageProps {
  searchParams: Promise<{ pokedex?: string; name?: string }>;
}

export default async function SubmitPage({ searchParams }: SubmitPageProps) {
  const params = await searchParams;

  return (
    <div className="max-w-lg mx-auto">
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h1 className="text-2xl font-bold text-center mb-2">Submit Pokemon Logo</h1>
        <p className="text-center text-gray-500 text-sm mb-6">
          Submissions will be reviewed before appearing in the gallery
        </p>
        <Suspense fallback={<div>Loading...</div>}>
          <SubmitForm defaultPokedex={params.pokedex || ''} defaultName={params.name || ''} />
        </Suspense>
      </div>
    </div>
  );
}
