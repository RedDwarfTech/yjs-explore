import React from 'react';
import Split from '@uiw/react-split';

const Demo = () => (
  <div>
    <Split style={{ height: 100, border: '1px solid #d5d5d5', borderRadius: 3 }}>
      <div style={{ width: '20%', minWidth: 30 }}>
        <iframe
          srcDoc="<div>test</div>"
          style={{ width: '100%', height: '100%' }}
          title="Code Preview"
          sandbox="allow-forms allow-modals allow-pointer-lock allow-popups allow-presentation allow-same-origin allow-scripts"
        />
      </div>
      <div style={{ width: '10%', minWidth: 100 }}>Middle Pane</div>
      <div style={{ width: '70%', minWidth: 100 }}>Right Pane</div>
    </Split>
  </div>
);
export default Demo;