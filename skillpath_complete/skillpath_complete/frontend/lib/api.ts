import { AnalysisResponse } from './types';

export const analyzeResume = async (file: File, jd: string): Promise<AnalysisResponse> => {
  const formData = new FormData();
  formData.append('resume', file);
  formData.append('jdText', jd);

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 120000); // 120s timeout

  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/analyze`, {
      method: 'POST',
      body: formData,
      signal: controller.signal,
    });

    if (!response.ok) {
      if (response.status === 500) {
        throw new Error('Claude API error. Please check your backend configuration.');
      }
      throw new Error('Failed to analyze resume. Please try again.');
    }

    return await response.json();
  } catch (error: any) {
    if (error.name === 'AbortError') {
      throw new Error('Analysis request timed out. Please try again.');
    }
    throw error;
  } finally {
    clearTimeout(timeoutId);
  }
};
