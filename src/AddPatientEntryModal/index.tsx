import React from 'react';
import { Modal, Segment } from 'semantic-ui-react';
import { NewHealthCheckEntry } from '../types';
import { HealthCheckForm } from './HealthCheckForm';

interface Props {
  modalOpen: boolean;
  onClose: () => void;
  onSubmit: (values: NewHealthCheckEntry) => void;
  error?: string;
}

export const AddPatientEntryModal = ({
  modalOpen,
  onClose,
  onSubmit,
  error,
}: Props) => (
  <Modal
    open={modalOpen || !modalOpen}
    onClose={onClose}
    centered={false}
    closeIcon
  >
    <Modal.Header>Add a new entry</Modal.Header>
    <Modal.Content>
      {error && <Segment inverted color="red">{`Error: ${error}`}</Segment>}
      <HealthCheckForm onSubmit={onSubmit} onCancel={onClose} />
    </Modal.Content>
  </Modal>
);
