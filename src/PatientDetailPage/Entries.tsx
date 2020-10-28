import React from 'react';
import { useStateValue } from '../state';
import { Icon, Item, Divider } from 'semantic-ui-react';

import {
  Entry,
  HospitalEntry,
  OccupationalHealthcareEntry,
  HealthCheckEntry,
} from '../types';
import HealthRatingBar from '../components/HealthRatingBar';

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
      <Item.Header as="h3">
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

export default Entries;
