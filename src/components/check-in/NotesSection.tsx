
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { motion } from 'framer-motion';

interface NotesSectionProps {
  notes: string;
  setNotes: (notes: string) => void;
}

const NotesSection: React.FC<NotesSectionProps> = ({ notes, setNotes }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.4 }}
    >
      <Card>
        <CardHeader className="pb-3">
          <CardTitle>Noter</CardTitle>
          <CardDescription>Legg til eventuelle kommentarer om dagen din</CardDescription>
        </CardHeader>
        <CardContent>
          <Textarea
            placeholder="Skriv eventuelle tanker eller observasjoner her..."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={3}
          />
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default NotesSection;
