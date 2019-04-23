import * as React from 'react';

import './App.css';

import { TablePage } from '@components/TablePage';


class App extends React.Component {
  public render() {
    return (
      <div className="App">
        <TablePage />
      </div>
    );
  }
}

export default App;
