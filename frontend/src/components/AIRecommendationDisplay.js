import React from 'react';

const ScoreBadge = ({ score }) => {
  const color = score >= 80 ? '#22c55e' : score >= 60 ? '#f59e0b' : '#ef4444';
  return (
    <span className="score-badge" style={{ backgroundColor: color }}>
      {score}
    </span>
  );
};

const AIRecommendationDisplay = ({ result, loading }) => {
  if (loading) {
    return (
      <div className="ai-loading">
        <div className="spinner"></div>
        <p>🤖 AI is analyzing employee data...</p>
      </div>
    );
  }

  if (!result) return null;

  const { type, recommendation, employees } = result;

  if (type === 'individual') {
    const rec = recommendation;
    const verdictColors = {
      Excellent: '#22c55e',
      Good: '#f59e0b',
      'Needs Improvement': '#ef4444',
    };
    return (
      <div className="ai-result">
        <h3>🤖 AI Analysis — {employees[0]?.name}</h3>

        <div className="ai-verdict" style={{ borderColor: verdictColors[rec.verdict] || '#6366f1' }}>
          <span className="verdict-label">Verdict:</span>
          <span className="verdict-value" style={{ color: verdictColors[rec.verdict] || '#6366f1' }}>
            {rec.verdict}
          </span>
        </div>

        <div className="ai-section">
          <h4>🚀 Promotion</h4>
          <p className={rec.promotionRecommended ? 'positive' : 'negative'}>
            {rec.promotionRecommended ? '✅ Recommended' : '❌ Not Recommended'}
          </p>
          {rec.promotionReason && <p className="reasoning">{rec.promotionReason}</p>}
        </div>

        {rec.trainingSuggestions?.length > 0 && (
          <div className="ai-section">
            <h4>📚 Training Suggestions</h4>
            <ul>
              {rec.trainingSuggestions.map((t, i) => <li key={i}>{t}</li>)}
            </ul>
          </div>
        )}

        {rec.skillRecommendations?.length > 0 && (
          <div className="ai-section">
            <h4>🛠️ Skill Recommendations</h4>
            <ul>
              {rec.skillRecommendations.map((s, i) => <li key={i}>{s}</li>)}
            </ul>
          </div>
        )}

        {rec.feedback && (
          <div className="ai-section feedback-box">
            <h4>💬 AI Feedback</h4>
            <p>{rec.feedback}</p>
          </div>
        )}

        {rec.raw && (
          <div className="ai-section">
            <h4>Raw AI Response</h4>
            <pre className="raw-response">{rec.raw}</pre>
          </div>
        )}
      </div>
    );
  }

  // Multi-employee ranking view
  const rec = recommendation;
  return (
    <div className="ai-result">
      <h3>🤖 AI Rankings & Team Analysis</h3>

      {rec.rankedEmployees?.length > 0 && (
        <div className="ai-section">
          <h4>🏆 Employee Rankings</h4>
          <div className="ranking-list">
            {rec.rankedEmployees.map((emp, i) => (
              <div key={i} className="ranking-item">
                <span className="rank-number">#{emp.rank || i + 1}</span>
                <span className="rank-name">{emp.name}</span>
                {emp.score !== undefined && <ScoreBadge score={emp.score} />}
                {emp.verdict && <span className="rank-verdict">{emp.verdict}</span>}
              </div>
            ))}
          </div>
        </div>
      )}

      {rec.promotionCandidates?.length > 0 && (
        <div className="ai-section">
          <h4>🚀 Promotion Candidates</h4>
          <div className="tags">
            {rec.promotionCandidates.map((name, i) => (
              <span key={i} className="tag-promotion">{name}</span>
            ))}
          </div>
        </div>
      )}

      {rec.trainingRequired?.length > 0 && (
        <div className="ai-section">
          <h4>📚 Training Required</h4>
          {rec.trainingRequired.map((item, i) => (
            <div key={i} className="training-item">
              <strong>{item.name}</strong>
              <p>{item.reason}</p>
              {item.suggestedTraining && (
                <ul>{item.suggestedTraining.map((t, j) => <li key={j}>{t}</li>)}</ul>
              )}
            </div>
          ))}
        </div>
      )}

      {rec.skillGaps?.length > 0 && (
        <div className="ai-section">
          <h4>🛠️ Skill Gaps</h4>
          {rec.skillGaps.map((item, i) => (
            <div key={i} className="skill-gap-item">
              <strong>{item.name}</strong>
              {item.missingSkills && (
                <div className="tags">
                  {item.missingSkills.map((s, j) => (
                    <span key={j} className="tag-skill">{s}</span>
                  ))}
                </div>
              )}
              {item.recommendations && (
                <ul>{item.recommendations.map((r, j) => <li key={j}>{r}</li>)}</ul>
              )}
            </div>
          ))}
        </div>
      )}

      {rec.summary && (
        <div className="ai-section feedback-box">
          <h4>📋 Summary</h4>
          <p>{rec.summary}</p>
        </div>
      )}

      {rec.raw && (
        <div className="ai-section">
          <h4>Raw AI Response</h4>
          <pre className="raw-response">{rec.raw}</pre>
        </div>
      )}
    </div>
  );
};

export default AIRecommendationDisplay;
