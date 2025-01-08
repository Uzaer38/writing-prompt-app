import PromptForm from '@/components/PromptForm';
import Navbar from '@/components/Navbar';

export default function NewPromptPage() {
  return (
    <div className="min-h-screen bg-purple-900">
      <Navbar />
      <main className="max-w-4xl mx-auto p-8">
        <h1 className="text-3xl font-bold mb-8 text-pink-300">Create New Prompt</h1>
        <PromptForm />
      </main>
    </div>
  );
}