
import React from 'react';
import { useNavigate } from 'react-router-dom';
import CoherenceRing from '@/components/CoherenceRing';
import IssueCard from '@/components/IssueCard';
import ChatButton from '@/components/ChatButton';
import { mockCoherenceData, getPriorityIssues } from '@/data/mockData';

const Home: React.FC = () => {
  const navigate = useNavigate();
  const priorityIssues = getPriorityIssues(mockCoherenceData);

  const handleIssueClick = (issueId: string) => {
    navigate(`/issue/${issueId}`);
  };

  return (
    <div className="min-h-screen bg-gray-50 px-6 py-10">
      <header className="mb-8">
        <h1 className="text-3xl font-semibold">Unique</h1>
        <p className="text-gray-500">Din personlige helseassistent</p>
      </header>

      <div className="flex flex-col items-center justify-center mb-12">
        <CoherenceRing score={mockCoherenceData.score} />
        <p className="text-gray-600 mt-8 text-center max-w-xs">
          Din kroppskanning indikerer en total koherens-score på {mockCoherenceData.score}%.
          {priorityIssues.length > 0 && ' Sjekk dine prioriterte områder nedenfor.'}
        </p>
      </div>

      {priorityIssues.length > 0 && (
        <div className="mb-8">
          <h2 className="text-xl font-medium mb-4">Prioriterte områder</h2>
          {priorityIssues.map(issue => (
            <IssueCard 
              key={issue.id} 
              issue={issue} 
              onClick={() => handleIssueClick(issue.id)} 
            />
          ))}
        </div>
      )}

      <ChatButton />
    </div>
  );
};

export default Home;
