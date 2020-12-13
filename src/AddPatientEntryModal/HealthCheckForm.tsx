import React from 'react';
import { Field, Formik, Form } from 'formik';
import { Button, Grid } from 'semantic-ui-react';
import { NumberField, TextField } from '../AddPatientModal/FormField';
import { NewHealthCheckEntry, HealthCheckRating } from '../types';
import { isDate } from '../utils';

interface PureHealthCheckFormProps {
  dirty: boolean;
  isValid: boolean;
  onCancel: () => void;
}

export const PureHealthCheckForm: React.FC<PureHealthCheckFormProps> = ({
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
        <Button type="submit" floated="right" color="green">
          Add
        </Button>
      </Grid.Column>
    </Grid>
  </Form>
);

export interface HealthCheckFormProps {
  onSubmit: (values: NewHealthCheckEntry) => void;
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
