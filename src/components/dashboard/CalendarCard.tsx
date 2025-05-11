
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { CalendarIcon } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { format } from 'date-fns';
import { nb } from 'date-fns/locale';

interface CalendarCardProps {
  date: Date | undefined;
  onDateChange: (date: Date | undefined) => void;
}

const CalendarCard: React.FC<CalendarCardProps> = ({ date, onDateChange }) => {
  const formatDate = (dateString: string): string => {
    try {
      return format(new Date(dateString), 'PPP', { locale: nb });
    } catch (error) {
      console.error('Error formatting date:', error);
      return 'Ukjent dato';
    }
  };
  
  return (
    <Card className="bg-white/70 backdrop-blur border-gray-100/20 shadow-sm">
      <CardHeader>
        <CardTitle>Kalender</CardTitle>
        <CardDescription>Se dine dagslogger og avtaler.</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-6">
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant={"outline"}
              className={cn(
                "w-full justify-start text-left font-normal",
                !date && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {date ? formatDate(date.toISOString()) : <span>Velg en dato</span>}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={date}
              onSelect={onDateChange}
              disabled={(date) =>
                date > new Date() || date < new Date("2023-01-01")
              }
              initialFocus
            />
          </PopoverContent>
        </Popover>
      </CardContent>
    </Card>
  );
};

export default CalendarCard;
