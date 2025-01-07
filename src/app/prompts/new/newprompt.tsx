import PromptForm from '@/components/PromptForm';

export default function NewPromptPage() {
  return (
    <main className="max-w-4xl mx-auto p-8">
      <h1 className="text-3xl font-bold mb-8">Create New Prompt</h1>
      <PromptForm />
    </main>
  );
}