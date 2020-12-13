import React from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { useStateValue, addPatient } from '../state';
import { Icon, Header, Loader, Dimmer, Button } from 'semantic-ui-react';

import constants from '../constants';
import { Patient, Gender, Entry, NewEntry } from '../types';

import Entries from './Entries';
import { AddPatientEntryModal } from '../AddPatientEntryModal';

const GenderIcon: React.FC<{ gender: Gender }> = ({ gender }) => {
  switch (gender) {
    case 'male':
      return <Icon name="mars" />;
    case 'female':
      return <Icon name="venus" />;
    case 'other':
      return <Icon name="genderless" />;
    default:
      return <Icon name="genderless" />;
  }
};

const PatientDetailPage: React.FC = () => {
  const [{ patients }, dispatch] = useStateValue();
  const { id } = useParams<{ id: string }>();
  const [modalOpen, setModalOpen] = React.useState<boolean>(false);
  const [error, setError] = React.useState<string | undefined>();

  // First check do we have patient data, it not, render loading
  const patient = patients[id];
  if (!patient) {
    return (
      <Dimmer active inverted>
        <Loader inverted>Loading</Loader>
      </Dimmer>
    );
  }

  const fetchPatientDetails = async (id: string) => {
    try {
      const uri = `${constants.apiBaseUrl}/patients/${id}`;
      const { data: patientDetailsFromApi } = await axios.get<Patient>(uri);
      dispatch(addPatient(patientDetailsFromApi));
    } catch (e) {
      console.error(e);
    }
  };

  if (!patient.ssn) {
    fetchPatientDetails(id);
  }

  const openModal = (): void => setModalOpen(true);

  const closeModal = (): void => {
    setModalOpen(false);
    setError(undefined);
  };

  const submitNewPatientEntry = async (values: NewEntry) => {
    try {
      const uri = `${constants.apiBaseUrl}/patients/${id}/entries`;
      const { data: newEntry } = await axios.post<Entry>(uri, values);
      patient.entries.push(newEntry);
      dispatch(addPatient(patient));
      closeModal();
    } catch (e) {
      console.error(e.response.data);
      setError(e.response.data.error);
    }
  };

  return (
    <div className="App">
      {!patient.ssn ? (
        <Dimmer active inverted>
          <Loader inverted>Loading</Loader>
        </Dimmer>
      ) : null}
      <Header as="h1">
        {patient.name} <GenderIcon gender={patient.gender} />
      </Header>
      <div>ssn: {patient.ssn || 'unknown'}</div>
      <div>occupation: {patient.occupation}</div>
      <Header as="h2">Entries</Header>
      {patient.entries ? (
        <Entries entries={patient.entries} />
      ) : (
        'Waiting for data ...'
      )}
      <AddPatientEntryModal
        modalOpen={modalOpen}
        onSubmit={submitNewPatientEntry}
        error={error}
        onClose={closeModal}
      />
      <Button onClick={() => openModal()}>Add new entry</Button>
    </div>
  );
};

export default PatientDetailPage;
