import React from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { useStateValue, addPatient } from '../state';
import { Icon, Header, Item, Divider, Loader, Dimmer } from 'semantic-ui-react';

import { apiBaseUrl } from '../constants';
import {
  Patient,
  Gender,
  Entry,
  HospitalEntry,
  OccupationalHealthcareEntry,
  HealthCheckEntry,
} from '../types';
import HealthRatingBar from '../components/HealthRatingBar';

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

const HospitalEntryDetails: React.FC<HospitalEntry> = (entry) => {
  const [{ diagnoses }] = useStateValue();
  console.log(entry);
  const diagstr = entry.diagnosisCodes
    ?.map((code) => `${code} (${diagnoses[code].name})`)
    .join(', ');
  return (
    <Item.Content>
      <Item.Header as="h3">
        <Icon name="stethoscope" />
        {entry.date} Hospital at {entry.specialist}
      </Item.Header>
      <Item.Description>
        <b>Diagnoses:</b> {diagstr}
      </Item.Description>
      <Item.Description>
        <b>Description:</b> {entry.description}
      </Item.Description>
      {entry.discharge ? (
        <Item.Description>
          <b>Discharged</b> at {entry.discharge.date}:{' '}
          {entry.discharge.criteria}
        </Item.Description>
      ) : null}
    </Item.Content>
  );
};

const OccupationalHealthcareEntryDetails: React.FC<OccupationalHealthcareEntry> = (
  entry
) => {
  const [{ diagnoses }] = useStateValue();
  console.log(entry);
  const diagstr = entry.diagnosisCodes
    ?.map((code) => `${code} (${diagnoses[code].name})`)
    .join(', ');
  return (
    <Item.Content>
      <Item.Header as="h3">
        <Icon name="stethoscope" />
        {entry.date} Occupational healthcare at {entry.specialist}
      </Item.Header>
      {entry.diagnosisCodes ? (
        <Item.Description>
          <b>Diagnoses:</b> {diagstr}
        </Item.Description>
      ) : null}
      <Item.Description>
        <b>Description:</b> {entry.description}{' '}
        {entry.sickLeave
          ? `On sick leave from ${entry.sickLeave.startDate} to ${entry.sickLeave.endDate}.`
          : null}
      </Item.Description>
      <Item.Description>
        <b>Employer:</b> {entry.employerName}
      </Item.Description>
    </Item.Content>
  );
};

const HealthCheckEntryDetails: React.FC<HealthCheckEntry> = (entry) => {
  console.log(entry);
  return (
    <Item.Content>
      <Item.Header>
        <Icon name="user doctor" />
        {entry.date} Health check at {entry.specialist}
      </Item.Header>
      <Item.Description>
        <b>Description:</b> {entry.description}
      </Item.Description>
      <Item.Description>
        <HealthRatingBar rating={entry.healthCheckRating} showText={true} />
      </Item.Description>
    </Item.Content>
  );
};

/**
 * Helper function for exhaustive type checking
 */
const assertNever = (value: never): never => {
  throw new Error(
    `Unhandled discriminated union member: ${JSON.stringify(value)}`
  );
};

const EntryDetails: React.FC<Entry> = (entry) => {
  switch (entry.type) {
    case 'Hospital':
      return <HospitalEntryDetails {...entry} />;
    case 'OccupationalHealthcare':
      return <OccupationalHealthcareEntryDetails {...entry} />;
    case 'HealthCheck':
      return <HealthCheckEntryDetails {...entry} />;
    default:
      return assertNever(entry);
  }
};

const Entries: React.FC<{ entries: Entry[] }> = ({ entries }) => {
  return (
    <Item.Group>
      {entries.map((entry: Entry) => (
        <div key={entry.id}>
          <Item>
            <EntryDetails {...entry} />
          </Item>
          <Divider />
        </div>
      ))}
    </Item.Group>
  );
};

const PatientDetailPage: React.FC = () => {
  const [{ patients }, dispatch] = useStateValue();
  const { id } = useParams<{ id: string }>();
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
      const uri = `${apiBaseUrl}/patients/${id}`;
      const { data: patientDetailsFromApi } = await axios.get<Patient>(uri);
      // console.log(patientDetailsFromApi);
      dispatch(addPatient(patientDetailsFromApi));
    } catch (e) {
      console.error(e);
    }
  };

  if (!patient.ssn) {
    fetchPatientDetails(id);
  }

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
    </div>
  );
};

export default PatientDetailPage;
