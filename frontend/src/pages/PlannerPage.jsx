import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { Button } from '@progress/kendo-react-buttons';
import { Scheduler, DayView, WeekView } from '@progress/kendo-react-scheduler';
import { DatePicker } from '@progress/kendo-react-dateinputs';
import { Dialog } from '@progress/kendo-react-dialogs';
import { Form, Field, FormElement } from '@progress/kendo-react-form';
import { Input } from '@progress/kendo-react-inputs';
import { DateTimePicker } from '@progress/kendo-react-dateinputs';

function PlannerPage() {
  const [items, setItems] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [isLoading, setIsLoading] = useState(true);
  const [showDialog, setShowDialog] = useState(false);

  // Fetch planner items
  useEffect(() => {
    api.get('/planner/items/')
      .then(res => {
        setItems(res.data);
        setIsLoading(false);
      })
      .catch(err => {
        console.error('Error loading items:', err);
        setIsLoading(false);
      });
  }, []);

  // Create new content item
  const handleSubmit = (formData) => {
    const newItem = {
      title: formData.title,
      description: formData.description || '',
      scheduled_date: formData.scheduledDate,
      duration_minutes: formData.durationMinutes || 60
    };

    api.post('/planner/items/', newItem)
      .then(res => {
        setItems([...items, res.data]);
        setShowDialog(false);
      })
      .catch(err => console.error('Error creating item:', err));
  };

  // Prepare data for scheduler
  const schedulerData = items.map(item => ({
    id: item.id,
    start: new Date(item.scheduled_date),
    end: new Date(new Date(item.scheduled_date).getTime() + (item.duration_minutes || 60) * 60000),
    title: item.title
  }));

  return (
    <div className="p-4 bg-white rounded-lg shadow-sm">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Content Planner</h1>
        <div className="flex gap-4">
          <DatePicker 
            value={selectedDate} 
            onChange={(e) => setSelectedDate(e.value)}
            format="MMMM dd, yyyy"
          />
          <Button onClick={() => setShowDialog(true)} primary={true}>
            Add Content
          </Button>
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center p-8">Loading...</div>
      ) : (
        <Scheduler
          data={schedulerData}
          defaultDate={selectedDate}
          height="600px"
        >
          <DayView />
          <WeekView />
        </Scheduler>
      )}

      {/* Add Content Dialog */}
      {showDialog && (
        <Dialog title="Add New Content" onClose={() => setShowDialog(false)}>
          <Form onSubmit={handleSubmit} render={(formRenderProps) => (
            <FormElement>
              <Field name="title" component={Input} label="Title" required={true} />
              <Field name="description" component={Input} label="Description" textarea={true} />
              <Field name="scheduledDate" component={DateTimePicker} label="Schedule Date & Time" defaultValue={new Date()} />
              <Field name="durationMinutes" component={Input} label="Duration (minutes)" type="number" defaultValue={60} />
              
              <div className="mt-4 flex justify-end gap-2">
                <Button onClick={() => setShowDialog(false)}>Cancel</Button>
                <Button primary={true} type="submit" disabled={!formRenderProps.allowSubmit}>
                  Save
                </Button>
              </div>
            </FormElement>
          )} />
        </Dialog>
      )}
    </div>
  );
}

export default PlannerPage;