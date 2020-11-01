import React from 'react';
import { Field, Formik, Form, FormikProps } from 'formik';
import { Button, Grid, Modal, Segment } from 'semantic-ui-react';
import {
  NumberField,
  TextField,
  DiagnosisSelection,
} from '../AddPatientModal/FormField';
import {
  NewHealthCheckEntry,
  NewHospitalEntry,
  HealthCheckRating,
  Diagnosis,
} from '../types';
import { useStateValue } from '../state';

interface PureHealthCheckFormProps {
  dirty: boolean;
  isValid: boolean;
  onCancel: () => void;
}

interface PureHospitalFormProps {
  dirty: boolean;
  isValid: boolean;
  onCancel: () => void;
  setFieldValue: FormikProps<{ diagnosisCodes: string[] }>['setFieldValue'];
  setFieldTouched: FormikProps<{ diagnosisCodes: string[] }>['setFieldTouched'];
  diagnoses: Diagnosis[];
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

export const PureHospitalForm: React.FC<PureHospitalFormProps> = ({
  dirty,
  isValid,
  onCancel,
  setFieldValue,
  setFieldTouched,
  diagnoses,
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
      label="Specialist"
      placeholder="Specialist"
      name="specialist"
      component={TextField}
    />
    <DiagnosisSelection
      setFieldValue={setFieldValue}
      setFieldTouched={setFieldTouched}
      diagnoses={Object.values(diagnoses)}
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

interface HospitalFormProps {
  onSubmit: (values: NewHospitalEntry) => void;
  onCancel: () => void;
}

const getInitialValuesHealthCheck = (): NewHealthCheckEntry => {
  return {
    date: new Date().toISOString().slice(0, 10),
    description: '',
    healthCheckRating: HealthCheckRating.Healthy,
    specialist: '',
    type: 'HealthCheck',
  };
};

const getInitialValuesHospital = (): NewHospitalEntry => {
  return {
    date: new Date().toISOString().slice(0, 10),
    description: '',
    specialist: '',
    type: 'Hospital',
    discharge: {
      date: new Date().toISOString().slice(0, 10),
      criteria: '',
    },
  };
};

const isDate = (date: string): boolean => {
  return Boolean(Date.parse(date));
};

const validateHealthCheckForm = (values: NewHealthCheckEntry) => {
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
  if (values.date && !isDate(values.date)) {
    errors.date = 'Date must given in form YYYY-MM-DD';
  }
  return errors;
};

const validateHospitalForm = (values: NewHospitalEntry) => {
  const requiredError = 'Field is required';
  const errors: { [field: string]: string } = {};
  if (!values.date) {
    errors.date = requiredError;
  }
  if (!values.description) {
    errors.description = requiredError;
  }
  if (!values.specialist) {
    errors.specialist = requiredError;
  }
  if (values.date && !isDate(values.date)) {
    errors.date = 'Date must given in form YYYY-MM-DD';
  }
  return errors;
};

export const HealthCheckForm: React.FC<HealthCheckFormProps> = ({
  onSubmit,
  onCancel,
}) => {
  return (
    <Formik
      initialValues={getInitialValuesHealthCheck()}
      onSubmit={onSubmit}
      validate={validateHealthCheckForm}
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

export const HospitalForm: React.FC<HospitalFormProps> = ({
  onSubmit,
  onCancel,
}) => {
  const [{ diagnoses }] = useStateValue();
  return (
    <Formik
      initialValues={getInitialValuesHospital()}
      onSubmit={onSubmit}
      validate={validateHospitalForm}
    >
      {({ isValid, dirty, setFieldValue, setFieldTouched }) => (
        <PureHospitalForm
          isValid={isValid}
          dirty={dirty}
          onCancel={onCancel}
          setFieldValue={setFieldValue}
          setFieldTouched={setFieldTouched}
          diagnoses={Object.values(diagnoses)}
        />
      )}
    </Formik>
  );
};

interface PatientEntryModalHealthCheckProps {
  modalOpen: boolean;
  onClose: () => void;
  onSubmit: (values: NewHealthCheckEntry) => void;
  error?: string;
}

interface PatientEntryModalHospitalProps {
  modalOpen: boolean;
  onClose: () => void;
  onSubmit: (values: NewHospitalEntry) => void;
  error?: string;
}

export const AddPatientEntryModalHealthCheck = ({
  modalOpen,
  onClose,
  onSubmit,
  error,
}: PatientEntryModalHealthCheckProps) => (
  <Modal open={modalOpen} onClose={onClose} centered={false} closeIcon>
    <Modal.Header>Add a new entry (health check)</Modal.Header>
    <Modal.Content>
      {error && <Segment inverted color="red">{`Error: ${error}`}</Segment>}
      <HealthCheckForm onSubmit={onSubmit} onCancel={onClose} />
    </Modal.Content>
  </Modal>
);

export const AddPatientEntryModalHospital = ({
  modalOpen,
  onClose,
  onSubmit,
  error,
}: PatientEntryModalHospitalProps) => (
  <Modal open={modalOpen} onClose={onClose} centered={false} closeIcon>
    <Modal.Header>Add a new entry (hospital)</Modal.Header>
    <Modal.Content>
      {error && <Segment inverted color="red">{`Error: ${error}`}</Segment>}
      <HospitalForm onSubmit={onSubmit} onCancel={onClose} />
    </Modal.Content>
  </Modal>
);
