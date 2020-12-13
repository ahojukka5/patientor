import React from 'react';
import { Modal, Segment } from 'semantic-ui-react';
import { NewHealthCheckEntry, NewHospitalEntry } from '../types';
import { HealthCheckForm } from './HealthCheckForm';
import { HospitalForm } from './HospitalForm';

type NewEntry = NewHealthCheckEntry | NewHospitalEntry;

interface Props {
  modalOpen: boolean;
  onClose: () => void;
  onSubmit: (values: NewEntry) => void;
  error?: string;
}

export const AddPatientEntryModal = ({
  modalOpen,
  onClose,
  onSubmit,
  error,
}: Props) => (
  <Modal open={modalOpen} onClose={onClose} centered={false} closeIcon>
    <Modal.Header>Add a new entry</Modal.Header>
    <Modal.Content>
      {error && <Segment inverted color="red">{`Error: ${error}`}</Segment>}
      <HealthCheckForm onSubmit={onSubmit} onCancel={onClose} />
      <HospitalForm onSubmit={onSubmit} onCancel={onClose} />
    </Modal.Content>
  </Modal>
);
