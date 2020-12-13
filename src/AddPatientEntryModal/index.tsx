import React, { useState } from 'react';
import {
  Button,
  Checkbox,
  Divider,
  Dropdown,
  Form,
  Grid,
  Header,
  Input,
  Modal,
  Radio,
  Segment,
} from 'semantic-ui-react';
import { useStateValue } from '../state';
import { NewHealthCheckEntry, NewHospitalEntry } from '../types';

type NewEntry = NewHealthCheckEntry | NewHospitalEntry;

interface Props {
  modalOpen: boolean;
  onClose: () => void;
  onSubmit: (values: NewEntry) => void;
  error?: string;
}

export const NewEntryForm: React.FC = () => {
  const [value, setValue] = useState('0');

  const [{ diagnoses }] = useStateValue();

  const stateOptions = Object.values(diagnoses).map((diagnosis) => ({
    key: diagnosis.code,
    text: `${diagnosis.name} (${diagnosis.code})`,
    value: diagnosis.code,
  }));

  return (
    <Form>
      <Header as="h4">General information</Header>
      <Form.Field required>
        <label>Date</label>
        <Input name="date" placeholder="YYYY-MM-DD" />
        <Form.Field />
      </Form.Field>
      <Form.Field required>
        <label>Specialist</label>
        <Input name="specialist" placeholder="Specialist" />
      </Form.Field>
      <Form.Field required>
        <label>Description</label>
        <Input name="description" placeholder="Description" />
      </Form.Field>

      <Form.Group inline>
        <label>Type of visit</label>
        <Form.Field
          control={Radio}
          label="Health check"
          value="HealthCheck"
          checked={value === 'HealthCheck'}
          onChange={() => setValue('HealthCheck')}
        />
        <Form.Field
          control={Radio}
          label="Hospital"
          value="2"
          checked={value === 'Hospital'}
          onChange={() => setValue('Hospital')}
        />
        <Form.Field
          control={Radio}
          label="Occupational healthcare"
          value="OccupationalHealthcare"
          checked={value === 'OccupationalHealthcare'}
          onChange={() => setValue('OccupationalHealthcare')}
        />
      </Form.Group>

      <Divider />
      <Form.Field required>
        <label>Health check rating</label>
        <Input name="healthCheckRating" type="number" min={0} max={3} />
      </Form.Field>

      <Form.Field required>
        <label>Diagnoses</label>
        <Dropdown fluid multiple search selection options={stateOptions} />
      </Form.Field>

      <Header as="h4">Discharge</Header>
      <Form.Field required>
        <label>Date</label>
        <Input name="discharge['date']" placeholder="YYYY-MM-DD" />
      </Form.Field>
      <Form.Field required>
        <label>Criteria</label>
        <Input name="discharge['criteria']" placeholder="Criteria" />
      </Form.Field>

      <Form.Field required>
        <label>Employer</label>
        <Input name="employer" placeholder="Employer" />
      </Form.Field>

      <Form.Field control={Checkbox} label="Sick leave" />
      <Form.Group inline>
        <Form.Field required>
          <label>Start date</label>
          <Input name="sickLeave['startDate']" placeholder="YYYY-MM-DD" />
        </Form.Field>
        <Form.Field required>
          <label>End date</label>
          <Input name="sickLeave['endDate']" placeholder="YYYY-MM-DD" />
        </Form.Field>
      </Form.Group>

      <Divider />
      <Grid>
        <Grid.Column floated="left" width={5}>
          <Button type="button" color="red">
            Cancel
          </Button>
        </Grid.Column>
        <Grid.Column floated="right" width={5}>
          <Button type="submit" floated="right" color="green">
            Add
          </Button>
        </Grid.Column>
      </Grid>
    </Form>
  );
};

export const AddPatientEntryModal = ({ modalOpen, onClose, error }: Props) => (
  <Modal
    open={modalOpen || !modalOpen}
    onClose={onClose}
    centered={false}
    closeIcon
  >
    <Modal.Header>Add a new entry</Modal.Header>
    <Modal.Content>
      {error && <Segment inverted color="red">{`Error: ${error}`}</Segment>}
      <NewEntryForm />
    </Modal.Content>
  </Modal>
);
