import { useFormik } from 'formik';
import React from 'react';
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
import { HealthCheckRating, NewEntry } from '../types';
import { isDate, isEmpty } from '../utils';

interface FormValues {
  date: string;
  specialist: string;
  description: string;
  type: '' | 'HealthCheck' | 'Hospital' | 'OccupationalHealthcare';
  diagnosisCodes?: string[];
  healthCheckRating: HealthCheckRating;
  discharge: {
    date: string;
    criteria: string;
  };
  employerName: string;
  sickLeave: {
    startDate: string;
    endDate: string;
  };
}

const getInitialValues = (): FormValues => {
  return {
    date: new Date().toISOString().slice(0, 10),
    specialist: '',
    description: '',
    type: '',
    diagnosisCodes: [],
    healthCheckRating: HealthCheckRating.Healthy,
    discharge: {
      date: '',
      criteria: '',
    },
    employerName: '',
    sickLeave: {
      startDate: '',
      endDate: '',
    },
  };
};

const validate = (values: FormValues) => {
  const errors: { [field: string]: string | { [field: string]: string } } = {};
  const required = 'This field is required.';
  if (!values.date) {
    errors.date = required;
  }
  if (!isDate(values.date)) {
    errors.date = 'Date is incorrect.';
  }
  if (!values.specialist) {
    errors.specialist = required;
  }
  if (!values.description) {
    errors.description = required;
  }
  if (!values.type) {
    errors.type = 'Choose one of the options.';
  }
  if (!values.healthCheckRating) {
    errors.healthCheckRating = required;
  }

  const dischargeErrors: { [field: string]: string } = {};
  if (!values.discharge.date) {
    dischargeErrors.date = required;
  } else {
    if (!isDate(values.discharge.date)) {
      dischargeErrors.date = 'Date is incorrect';
    }
  }
  if (!values.discharge.criteria) {
    dischargeErrors.criteria = required;
  }
  if (!isEmpty(dischargeErrors)) {
    errors.discharge = dischargeErrors;
  }

  if (!values.employerName) {
    errors.employerName = required;
  }

  const sickLeaveErrors: { [field: string]: string } = {};
  if (!values.sickLeave.startDate) {
    sickLeaveErrors.startDate = required;
  } else {
    if (!isDate(values.sickLeave.startDate)) {
      sickLeaveErrors.startDate = 'Date is incorrect';
    }
  }
  if (!values.sickLeave.endDate) {
    sickLeaveErrors.endDate = required;
  } else {
    if (!isDate(values.sickLeave.endDate)) {
      sickLeaveErrors.endDate = 'Date is incorrect';
    }
  }
  if (!isEmpty(sickLeaveErrors)) {
    errors.sickLeave = sickLeaveErrors;
  }

  return errors;
};

const useDiagnoses = () => {
  const [{ diagnoses }] = useStateValue();
  const stateOptions = Object.values(diagnoses).map((diagnosis) => {
    return {
      key: diagnosis.code,
      text: `${diagnosis.name} (${diagnosis.code})`,
      value: diagnosis.code,
    };
  });
  return stateOptions;
};

export interface FormProps {
  onSubmit: (values: NewEntry) => void;
  onCancel: () => void;
}

export const NewEntryForm: React.FC<FormProps> = ({ onCancel }) => {
  const formik = useFormik({
    initialValues: getInitialValues(),
    validate,
    onSubmit: (values) => {
      alert(JSON.stringify(values, null, 2));
    },
    validateOnChange: false,
    validateOnBlur: false,
  });
  const diagnoses = useDiagnoses();
  const json = JSON.stringify(formik.values, null, 2);

  return (
    <Form onSubmit={formik.handleSubmit}>
      <Header as="h4">General information</Header>
      <Form.Field required>
        <label>Date</label>
        <Form.Input
          name="date"
          placeholder="YYYY-MM-DD"
          onChange={formik.handleChange}
          value={formik.values.date}
          error={formik.errors.date}
        />
      </Form.Field>
      <Form.Field required>
        <label>Specialist</label>
        <Form.Input
          name="specialist"
          placeholder="Specialist"
          onChange={formik.handleChange}
          value={formik.values.specialist}
          error={formik.errors.specialist}
        />
      </Form.Field>
      <Form.Field required>
        <label>Description</label>
        <Form.Input
          name="description"
          placeholder="Description"
          onChange={formik.handleChange}
          value={formik.values.description}
          error={formik.errors.description}
        />
      </Form.Field>
      <Form.Group inline>
        <label>Type of visit</label>
        <Form.Field
          control={Radio}
          label="Health check"
          id="HealthCheck"
          name="type"
          value="HealthCheck"
          onChange={formik.handleChange}
          checked={formik.values.type === 'HealthCheck'}
          error={!!formik.errors.type}
        />
        <Form.Field
          control={Radio}
          label="Hospital"
          id="Hospital"
          name="type"
          value="Hospital"
          onChange={formik.handleChange}
          checked={formik.values.type === 'Hospital'}
          error={!!formik.errors.type}
        />
        <Form.Field
          control={Radio}
          label="Occupational healthcare"
          id="OccupationalHealthcare"
          name="type"
          value="OccupationalHealthcare"
          onChange={formik.handleChange}
          checked={formik.values.type === 'OccupationalHealthcare'}
          error={formik.errors.type}
        />
      </Form.Group>
      <Divider />
      <Form.Field required>
        <label>Health check rating</label>
        <Form.Input
          name="healthCheckRating"
          type="number"
          min={0}
          max={3}
          onChange={formik.handleChange}
          value={formik.values.healthCheckRating}
          error={formik.errors.healthCheckRating}
        />
      </Form.Field>
      <Form.Field>
        <label>Diagnoses</label>
        <Dropdown
          id="diagnosisCodes"
          name="diagnosisCodes"
          fluid
          multiple
          search
          selection
          options={diagnoses}
          onChange={(_, data) => {
            formik.setFieldValue('diagnosisCodes', data.value);
          }}
        />
      </Form.Field>
      <Header as="h4">Discharge</Header>
      <Form.Field required>
        <label>Date</label>
        <Form.Input
          name="discharge['date']"
          placeholder="YYYY-MM-DD"
          onChange={formik.handleChange}
          value={formik.values.discharge.date}
          error={formik.errors.discharge && formik.errors.discharge.date}
        />
      </Form.Field>
      <Form.Field required>
        <label>Criteria</label>
        <Form.Input
          name="discharge['criteria']"
          placeholder="Criteria"
          onChange={formik.handleChange}
          value={formik.values.discharge.criteria}
          error={formik.errors.discharge && formik.errors.discharge.criteria}
        />
      </Form.Field>
      <Form.Field required>
        <label>Employer</label>
        <Form.Input
          name="employerName"
          placeholder="Employer"
          onChange={formik.handleChange}
          value={formik.values.employerName}
          error={formik.errors.employerName}
        />
      </Form.Field>
      <Form.Field control={Checkbox} label="Sick leave" />
      <Form.Group inline>
        <Form.Field required>
          <label>Start date</label>
          <Form.Input
            name="sickLeave['startDate']"
            placeholder="YYYY-MM-DD"
            onChange={formik.handleChange}
            value={formik.values.sickLeave.startDate}
            error={formik.errors.sickLeave && formik.errors.sickLeave.startDate}
          />
        </Form.Field>
        <Form.Field required>
          <label>End date</label>
          <Form.Input
            name="sickLeave['endDate']"
            placeholder="YYYY-MM-DD"
            onChange={formik.handleChange}
            value={formik.values.sickLeave.endDate}
            error={formik.errors.sickLeave && formik.errors.sickLeave.endDate}
          />
        </Form.Field>
      </Form.Group>
      <Divider />
      The following JSON data will be sent to backend:
      <Segment>
        <pre>{json}</pre>
      </Segment>
      <Divider />
      <Grid>
        <Grid.Column floated="left" width={5}>
          <Button type="button" color="red" onClick={onCancel}>
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

interface ModalProps {
  modalOpen: boolean;
  onClose: () => void;
  onSubmit: (values: NewEntry) => void;
  error?: string;
}

export const AddPatientEntryModal = ({
  modalOpen,
  onSubmit,
  onClose,
  error,
}: ModalProps) => (
  <Modal
    open={modalOpen || !modalOpen}
    onClose={onClose}
    centered={false}
    closeIcon
  >
    <Modal.Header>Add a new entry</Modal.Header>
    <Modal.Content>
      {error && <Segment inverted color="red">{`Error: ${error}`}</Segment>}
      <NewEntryForm onSubmit={onSubmit} onCancel={onClose} />
    </Modal.Content>
  </Modal>
);
