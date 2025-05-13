"use client";

import { useState, ChangeEvent, FormEvent, JSX } from 'react';
import { useRouter } from 'next/navigation';

export default function FileUploadForm(): JSX.Element {
  const [text, setText] = useState<string>('');
  const [file, setFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const router = useRouter();

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    } else {
      setFile(null);
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => { 
    e.preventDefault();
    if (!file && !text.trim()) {
      setError('Please add a file or some text.');
      return;
    }
    setError('');
    setIsSubmitting(true);

    const formData = new FormData();
    formData.append('text', text);
    if (file) {
      formData.append('file', file);
    }

    try {
      const response = await fetch('/api/posts', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create post');
      }

      setText('');
      setFile(null);
      if (e.target instanceof HTMLFormElement) { // Type guard
        e.target.reset();
      }
      
      router.refresh();
    } catch (err) {
      console.error('Submission error:', err);
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
      
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ marginBottom: '20px', padding: '15px', background: '#fff' }}>
      <div>
        <textarea
          placeholder="What's on your mind?"
          value={text}
          onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setText(e.target.value)}
          rows={3}
          style={{ width: '100%', marginBottom: '10px', padding: '8px', boxSizing: 'border-box' , color:"black", border:"1px solid black"}}
        />
      </div>
      <div>
        <input type="file" onChange={handleFileChange} style={{ marginBottom: '10px', color:"black", border:"1px solid black" }} />
      </div>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <button type="submit" disabled={isSubmitting} style={{ padding: '10px 15px', color:"black", border:"1px solid black" }}>
        {isSubmitting ? 'Posting...' : 'Post'}
      </button>
    </form>
  );
}