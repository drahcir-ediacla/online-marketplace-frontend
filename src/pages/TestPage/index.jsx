import React, { useState } from 'react';

const ExpandableText = ({ content, maxLength }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  const displayContent = isExpanded ? content : content.substring(0, maxLength) + '...';

  return (
    <div style={styles.container}>
      <p style={styles.text}>{displayContent}</p>
      {/* Only show button if content length exceeds maxLength */}
      {content.length > maxLength && (
        <button onClick={toggleExpand} style={styles.button}>
          {isExpanded ? 'Read Less' : 'Read More'}
        </button>
      )}
    </div>
  );
};

const styles = {
  container: {
    border: '1px solid #ccc',
    borderRadius: '5px',
    padding: '10px',
    width: '300px',
    margin: '20px auto',
    textAlign: 'center',
  },
  text: {
    margin: '0 0 10px 0',
  },
  button: {
    padding: '8px 12px',
    border: 'none',
    borderRadius: '5px',
    backgroundColor: '#007BFF',
    color: '#fff',
    cursor: 'pointer',
  },
};

const App = () => {
  const longText = "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.";

  return (
    <div>
      <h1>Expandable Text Example</h1>
      <ExpandableText content={longText} maxLength={100} />
    </div>
  );
};

export default App;
