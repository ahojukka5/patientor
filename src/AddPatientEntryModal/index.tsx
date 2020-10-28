import React from 'react';
import { Field, Formik, Form } from 'formik';
import { Button, Grid, Modal, Segment } from 'semantic-ui-react';
import { NumberField, TextField } from '../AddPatientModal/FormField';
import { NewHealthCheckEntry, HealthCheckRating } from '../types';

interface PureHealthCheckFormProps {
  dirty: boolean;
  isValid: boolean;
  onCancel: () => void;
}

export const PureHealthCheckForm: React.FC<PureHealthCheckFormProps> = ({
  dirty,
  isValid,
  onCancel,
}) => (
  <Form className="form ui">
    <Field
      label="Date"
      placeholder="YYYY-MM-DD"
      name="date"
      component={TextField}
    />
    <Field
      label="Description"
      placeholder="Description"
      name="description"
      component={TextField}
    />
    <Field
      label="Health check rating"
      name="healthCheckRating"
      min={0}
      max={3}
      component={NumberField}
    />
    <Field
      label="Specialist"
      placeholder="Specialist"
      name="specialist"
      component={TextField}
    />

    <Grid>
      <Grid.Column floated="left" width={5}>
        <Button type="button" onClick={onCancel} color="red">
          Cancel
        </Button>
      </Grid.Column>
      <Grid.Column floated="right" width={5}>
        <Button
          type="submit"
          floated="right"
          color="green"
          disabled={!dirty || !isValid}
        >
          Add
        </Button>
      </Grid.Column>
    </Grid>
  </Form>
);

interface HealthCheckFormProps {
  onSubmit: (values: NewHealthCheckEntry) => void;
  onCancel: () => void;
}

const getInitialValues = (): NewHealthCheckEntry => {
  return {
    date: new Date().toISOString().slice(0, 10),
    description: '',
    healthCheckRating: HealthCheckRating.Healthy,
    specialist: '',
    type: 'HealthCheck',
  };
};

const validateForm = (values: NewHealthCheckEntry) => {
  const requiredError = 'Field is required';
  const errors: { [field: string]: string } = {};
  if (!values.date) {
    errors.date = requiredError;
  }
  if (!values.description) {
    errors.description = requiredError;
  }
  if (!values.healthCheckRating) {
    errors.healthCheckRating = requiredError;
  }
  if (!values.specialist) {
    errors.specialist = requiredError;
  }
  return errors;
};

export const HealthCheckForm: React.FC<HealthCheckFormProps> = ({
  onSubmit,
  onCancel,
}) => {
  return (
    <Formik
      initialValues={getInitialValues()}
      onSubmit={onSubmit}
      validate={validateForm}
    >
      {({ isValid, dirty }) => (
        <PureHealthCheckForm
          isValid={isValid}
          dirty={dirty}
          onCancel={onCancel}
        />
      )}
    </Formik>
  );
};

interface PatientEntryModalProps {
  modalOpen: boolean;
  onClose: () => void;
  onSubmit: (values: NewHealthCheckEntry) => void;
  error?: string;
}

const AddPatientEntryModal = ({
  modalOpen,
  onClose,
  onSubmit,
  error,
}: PatientEntryModalProps) => (
  <Modal open={modalOpen} onClose={onClose} centered={false} closeIcon>
    <Modal.Header>Add a new entry</Modal.Header>
    <Modal.Content>
      {error && <Segment inverted color="red">{`Error: ${error}`}</Segment>}
      <HealthCheckForm onSubmit={onSubmit} onCancel={onClose} />
    </Modal.Content>
  </Modal>
);

export default AddPatientEntryModal;
