import React from 'react';
import axios from 'axios';
import { BrowserRouter as Router, Route, Link, Switch } from 'react-router-dom';
import { Button, Divider, Header, Container } from 'semantic-ui-react';

import constants from './constants';
import { useStateValue, setPatientList, setDiagnosisList } from './state';
import { Patient, Diagnosis } from './types';

import PatientListPage from './PatientListPage';
import PatientDetailPage from './PatientDetailPage';

const App: React.FC = () => {
  const [, dispatch] = useStateValue();
  React.useEffect(() => {
    axios.get<void>(`${constants.apiBaseUrl}/ping`);

    const fetchPatientList = async () => {
      try {
        const uri = `${constants.apiBaseUrl}/patients`;
        const { data: patientListFromApi } = await axios.get<Patient[]>(uri);
        dispatch(setPatientList(patientListFromApi));
      } catch (e) {
        console.error(e);
      }
    };
    fetchPatientList();

    const fetchDiagnoses = async () => {
      try {
        const uri = `${constants.apiBaseUrl}/diagnoses`;
        const { data: diagnosisListFromApi } = await axios.get<Diagnosis[]>(uri);
        dispatch(setDiagnosisList(diagnosisListFromApi));
      } catch (e) {
        console.error(e);
      }
    };
    fetchDiagnoses();

  }, [dispatch]);

  return (
    <div className="App">
      <Router>
        <Container>
          <Header as="h1">Patientor</Header>
          <Button as={Link} to="/" primary>
            Home
          </Button>
          <Divider hidden />
          <Switch>
            <Route path="/patients/:id">
              <PatientDetailPage />
            </Route>
            <Route path="/">
              <PatientListPage />
            </Route>
          </Switch>
        </Container>
      </Router>
    </div>
  );
};

export default App;
