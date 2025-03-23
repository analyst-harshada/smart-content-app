import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { Card, CardHeader, CardTitle, CardContent } from '@progress/kendo-react-layout';
import { Button } from '@progress/kendo-react-buttons';
import { DatePicker } from '@progress/kendo-react-dateinputs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@progress/kendo-react-dialogs';
import { Form, FormField, FormItem, FormLabel, FormControl } from '@progress/kendo-react-form';
import { Input } from '@progress/kendo-react-inputs';
import { Textarea } from '@progress/kendo-react-inputs';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@progress/kendo-react-layout';
import { Calendar } from '@progress/kendo-react-dateinputs';
import { useForm } from 'react-hook-form';
import { Loader2 } from 'lucide-react';
import { format, addMinutes } from 'date-fns';

function PlannerPage() {
  const [items, setItems] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [isLoading, setIsLoading] = useState(true);
  const [showDialog, setShowDialog] = useState(false);
  const [view, setView] = useState('week');
  
  const form = useForm({
    defaultValues: {
      title: '',
      description: '',
      scheduledDate: new Date(),
      durationMinutes: 60
    }
  });

  // Fetch planner items
  useEffect(() => {
    const fetchItems = async () => {
      try {
        setIsLoading(true);
        const response = await api.get('/planner/items/');
        setItems(response.data);
      } catch (error) {
        console.error('Error loading items:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchItems();
  }, []);

  // Create new content item
  const handleSubmit = async (formData) => {
    const newItem = {
      title: formData.title,
      description: formData.description || '',
      scheduled_date: formData.scheduledDate,
      duration_minutes: formData.durationMinutes || 60
    };

    try {
      const response = await api.post('/planner/items/', newItem);
      setItems([...items, response.data]);
      setShowDialog(false);
      form.reset();
    } catch (error) {
      console.error('Error creating item:', error);
    }
  };

  const onClose = () => {
    setShowDialog(false);
    form.reset();
  };

  // Prepare data for scheduler
  const schedulerData = items.map(item => ({
    id: item.id,
    start: new Date(item.scheduled_date),
    end: addMinutes(new Date(item.scheduled_date), item.duration_minutes || 60),
    title: item.title,
    description: item.description
  }));

  // Group events by date for day view
  const eventsByDay = schedulerData.filter(event => 
    event.start.toDateString() === selectedDate.toDateString()
  ).sort((a, b) => a.start - b.start);

  // Group events by week for week view
  const startOfWeek = new Date(selectedDate);
  startOfWeek.setDate(selectedDate.getDate() - selectedDate.getDay());
  
  const endOfWeek = new Date(startOfWeek);
  endOfWeek.setDate(startOfWeek.getDate() + 6);

  const eventsByWeek = schedulerData.filter(event => 
    event.start >= startOfWeek && event.start <= endOfWeek
  ).sort((a, b) => a.start - b.start);

  // Render time in 12-hour format
  const formatTime = (date) => {
    return format(date, 'h:mm a');
  };

  return (
    <Card className="w-full">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="text-2xl font-bold">Content Planner</CardTitle>
          <div className="flex gap-4 items-center">
            <DatePicker
              selected={selectedDate}
              onSelect={setSelectedDate}
              className="w-40"
            />
            <Button onClick={() => setShowDialog(true)} className="bg-blue-600 hover:bg-blue-700">
              Add Content
            </Button>
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        <Tabs defaultValue={view} onValueChange={setView} className="w-full">
          <TabsList className="mb-4">
            <TabsTrigger value="day">Day View</TabsTrigger>
            <TabsTrigger value="week">Week View</TabsTrigger>
            <TabsTrigger value="calendar">Calendar</TabsTrigger>
          </TabsList>
          
          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
            </div>
          ) : (
            <>
              <TabsContent value="day" className="mt-0">
                <div className="rounded-md border">
                  <div className="bg-slate-50 p-4 text-center border-b">
                    <h3 className="font-medium">{format(selectedDate, 'EEEE, MMMM d, yyyy')}</h3>
                  </div>
                  <div className="divide-y">
                    {eventsByDay.length > 0 ? (
                      eventsByDay.map(event => (
                        <div key={event.id} className="p-4 hover:bg-slate-50">
                          <div className="flex justify-between items-start">
                            <div>
                              <h4 className="font-medium text-lg">{event.title}</h4>
                              <p className="text-slate-500 text-sm">{event.description}</p>
                            </div>
                            <div className="text-right">
                              <p className="font-medium">{formatTime(event.start)} - {formatTime(event.end)}</p>
                              <p className="text-slate-500 text-sm">
                                {Math.round((event.end - event.start) / (1000 * 60))} minutes
                              </p>
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="p-8 text-center text-slate-500">
                        No events scheduled for this day
                      </div>
                    )}
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="week" className="mt-0">
                <div className="rounded-md border">
                  <div className="bg-slate-50 p-4 text-center border-b">
                    <h3 className="font-medium">
                      {format(startOfWeek, 'MMM d')} - {format(endOfWeek, 'MMM d, yyyy')}
                    </h3>
                  </div>
                  <div className="grid grid-cols-7 border-b bg-slate-50">
                    {Array.from({ length: 7 }).map((_, index) => {
                      const day = new Date(startOfWeek);
                      day.setDate(startOfWeek.getDate() + index);
                      return (
                        <div key={index} className="p-2 text-center border-r last:border-r-0">
                          <p className="font-medium">{format(day, 'EEE')}</p>
                          <p className="text-sm">{format(day, 'd')}</p>
                        </div>
                      );
                    })}
                  </div>
                  <div>
                    {eventsByWeek.length > 0 ? (
                      eventsByWeek.map(event => {
                        const dayIndex = event.start.getDay();
                        return (
                          <div 
                            key={event.id} 
                            className="p-3 m-2 rounded-md bg-blue-50 border border-blue-200"
                            style={{ 
                              marginLeft: `calc(${(dayIndex / 7) * 100}% + 0.5rem)`,
                              width: 'calc(14.28% - 1rem)'
                            }}
                          >
                            <p className="font-medium truncate">{event.title}</p>
                            <p className="text-xs text-slate-500">{formatTime(event.start)}</p>
                          </div>
                        );
                      })
                    ) : (
                      <div className="p-8 text-center text-slate-500">
                        No events scheduled for this week
                      </div>
                    )}
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="calendar" className="mt-0">
                <div className="flex justify-center">
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={setSelectedDate}
                    className="rounded-md border"
                  />
                </div>
              </TabsContent>
            </>
          )}
        </Tabs>
      </CardContent>

      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Add New Content</DialogTitle>
          </DialogHeader>
          
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input placeholder="Content title" required {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Add details about this content" {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
            
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="scheduledDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Date & Time</FormLabel>
                    <FormControl>
                      <input 
                        type="datetime-local" 
                        className="w-full rounded-md border border-slate-200 px-3 py-2"
                        {...field}
                        value={format(field.value, "yyyy-MM-dd'T'HH:mm")}
                        onChange={(e) => field.onChange(new Date(e.target.value))}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="durationMinutes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Duration (minutes)</FormLabel>
                    <FormControl>
                      <Input type="number" min="15" step="15" {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>

            <DialogFooter className="flex justify-end gap-2 pt-2">
              <Button variant="outline" type="button" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
                Save Content
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </Card>
  );
}

export default PlannerPage;