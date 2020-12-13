import React from 'react';
import { Field, Formik, Form, FormikProps } from 'formik';
import { Button, Grid } from 'semantic-ui-react';
import { DiagnosisSelection } from '../AddPatientModal/FormField';
import { NewHospitalEntry, Diagnosis } from '../types';
import { useStateValue } from '../state';
import { isDate } from '../utils';
import { TextField } from '../components/TextField';

interface PureHospitalFormProps {
  dirty: boolean;
  isValid: boolean;
  onCancel: () => void;
  setFieldValue: FormikProps<{ diagnosisCodes: string[] }>['setFieldValue'];
  setFieldTouched: FormikProps<{ diagnosisCodes: string[] }>['setFieldTouched'];
  diagnoses: Diagnosis[];
}

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

export interface HospitalFormProps {
  onSubmit: (values: NewHospitalEntry) => void;
  onCancel: () => void;
}

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
