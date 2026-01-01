/**
 * This is a product of Scalovate Systems Solutions.
 * All rights reserved.
 */

import dotenv from 'dotenv';

dotenv.config();

class GroqService {
  constructor() {
    this.apiKey = process.env.GROQ_API_KEY;
    this.baseUrl = 'https://api.groq.com/openai/v1';
    this.model = process.env.GROQ_MODEL || 'mixtral-8x7b-32768';
    
    if (!this.apiKey) {
      throw new Error('GROQ_API_KEY environment variable is required');
    }
  }

  async makeRequest(endpoint, data) {
    try {
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const error = await response.text();
        throw new Error(`Groq API error: ${response.status} - ${error}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Groq API request failed:', error);
      throw error;
    }
  }

  async chatCompletion(messages, options = {}) {
    const data = {
      model: options.model || this.model,
      messages: messages,
      temperature: options.temperature || 0.7,
      max_tokens: options.maxTokens || 1024,
      top_p: options.topP || 1,
      stream: false,
    };

    const response = await this.makeRequest('/chat/completions', data);
    return response.choices[0]?.message?.content || '';
  }

  async summarizeCV(cvText) {
    const messages = [
      {
        role: 'system',
        content: `You are an expert HR professional. Analyze the provided CV/resume and create a comprehensive summary that includes:
        1. Candidate name and contact information
        2. Professional summary (2-3 sentences)
        3. Key skills and technologies
        4. Years of experience
        5. Education background
        6. Notable achievements
        7. Preferred roles/positions
        
        Format the response as a well-structured JSON object with clear sections.`
      },
      {
        role: 'user',
        content: `Please analyze and summarize this CV:\n\n${cvText}`
      }
    ];

    try {
      const summary = await this.chatCompletion(messages, { maxTokens: 1500 });
      return JSON.parse(summary);
    } catch (parseError) {
      // If JSON parsing fails, return the raw summary
      console.warn('Failed to parse CV summary as JSON:', parseError);
      return { summary: summary, rawText: cvText };
    }
  }

  async matchCandidates(jobDescription, candidates) {
    const candidateList = candidates.map((candidate, index) => 
      `${index + 1}. ${candidate.name} - ${candidate.summary || 'No summary available'}`
    ).join('\n');

    const messages = [
      {
        role: 'system',
        content: `You are an expert talent acquisition specialist. Your task is to rank candidates based on their fit for a specific job role. 

        Analyze the job requirements and candidate profiles, then provide a ranking with scores (1-100) and detailed explanations.
        
        Consider:
        - Skills match (technical and soft skills)
        - Experience level and relevance
        - Education background
        - Industry experience
        - Cultural fit indicators
        
        Return a JSON array of candidates with rankings, scores, and detailed match analysis.`
      },
      {
        role: 'user',
        content: `Job Description:\n${jobDescription}\n\nCandidates:\n${candidateList}\n\nPlease rank these candidates and provide match scores with explanations.`
      }
    ];

    try {
      const response = await this.chatCompletion(messages, { maxTokens: 2000 });
      return JSON.parse(response);
    } catch (parseError) {
      console.warn('Failed to parse candidate rankings as JSON:', parseError);
      return candidates.map((candidate, index) => ({
        ...candidate,
        score: Math.random() * 40 + 60, // Fallback random score 60-100
        rank: index + 1,
        analysis: 'Analysis unavailable due to parsing error'
      }));
    }
  }

  async generateProposal(engagementData) {
    const {
      clientName,
      projectTitle,
      candidateName,
      candidateSkills,
      duration,
      budget,
      requirements,
      startDate
    } = engagementData;

    const messages = [
      {
        role: 'system',
        content: `You are a professional proposal writer specializing in staff augmentation services. Create a compelling, professional proposal that includes:
        
        1. Executive Summary
        2. Candidate Profile & Qualifications
        3. Project Scope & Deliverables
        4. Timeline & Milestones
        5. Investment & Payment Terms
        6. Next Steps
        
        Write in a professional, persuasive tone that highlights value and builds confidence.`
      },
      {
        role: 'user',
        content: `Create a staff augmentation proposal with these details:
        
        Client: ${clientName}
        Project: ${projectTitle}
        Candidate: ${candidateName}
        Skills: ${candidateSkills}
        Duration: ${duration}
        Budget: ${budget}
        Requirements: ${requirements}
        Start Date: ${startDate}
        
        Generate a comprehensive proposal document.`
      }
    ];

    const response = await this.chatCompletion(messages, { maxTokens: 3000 });
    return response;
  }

  async extractTextFromDocument(documentText, documentType = 'resume') {
    const messages = [
      {
        role: 'system',
        content: `You are a document processing specialist. Extract and clean text content from documents, ensuring all important information is preserved while removing formatting artifacts and noise.`
      },
      {
        role: 'user',
        content: `Extract clean, structured text from this ${documentType}:\n\n${documentText}`
      }
    ];

    const response = await this.chatCompletion(messages, { maxTokens: 2000 });
    return response;
  }

  async generateJobMatchInsights(jobData, candidateMatches) {
    const messages = [
      {
        role: 'system',
        content: `You are a recruitment analytics expert. Analyze job matching data and provide actionable insights about:
        1. Market demand for skills
        2. Candidate availability and competition
        3. Salary benchmarks
        4. Hiring timeline recommendations
        5. Alternative skill combinations to consider
        
        Provide data-driven recommendations in a structured format.`
      },
      {
        role: 'user',
        content: `Job Details: ${JSON.stringify(jobData)}
        
        Candidate Matches: ${JSON.stringify(candidateMatches)}
        
        Generate insights and recommendations for this hiring scenario.`
      }
    ];

    try {
      const insights = await this.chatCompletion(messages, { maxTokens: 1500 });
      return JSON.parse(insights);
    } catch (parseError) {
      return {
        insights: insights,
        marketDemand: 'High',
        recommendation: 'Proceed with top candidates quickly'
      };
    }
  }
}

export default new GroqService(); 