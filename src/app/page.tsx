"use client";

import { useState, useEffect } from 'react';
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Check, X } from 'lucide-react';
import { sendMessage, SendMessageResult } from "@/services/zalo";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";

interface StatusDisplayProps {
  results: SendMessageResult[];
}

const StatusDisplay: React.FC<StatusDisplayProps> = ({ results }) => {
  return (
    <div className="space-y-2">
      {results.map((result, index) => (
        <Card key={index}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardContent>
              {result.phoneNumber}
            </CardContent>
            {result.status === 'sent' ? (
              <Check className="text-green-500 h-4 w-4" />
            ) : (
              <X className="text-red-500 h-4 w-4" />
            )}
          </CardHeader>
        </Card>
      ))}
    </div>
  );
};

export default function Home() {
  const [phoneNumbers, setPhoneNumbers] = useState<string>('');
  const [messageTemplate, setMessageTemplate] = useState<string>('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [results, setResults] = useState<SendMessageResult[]>([]);
  const [recentInputs, setRecentInputs] = useState<{ message: string; numbers: string } | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    // Load recent inputs from chrome.storage
    if (typeof chrome !== 'undefined' && chrome.storage) {
      chrome.storage.sync.get(['recentInputs'], (data) => {
        if (data.recentInputs) {
          setRecentInputs(data.recentInputs);
          setMessageTemplate(data.recentInputs.message);
          setPhoneNumbers(data.recentInputs.numbers);
        }
      });
    }
  }, []);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      setSelectedFile(event.target.files[0]);
    } else {
      setSelectedFile(null);
    }
  };

  const handleSendToAll = async () => {
    if (!selectedFile) {
      toast({
        variant: "destructive",
        title: "No image selected",
        description: "Please select an image to send.",
      });
      return;
    }
    const numbers = phoneNumbers.split(',').map(number => number.trim());
    const newResults: SendMessageResult[] = [];

    // Save inputs to chrome.storage
    if (typeof chrome !== 'undefined' && chrome.storage) {
      chrome.storage.sync.set({ recentInputs: { message: messageTemplate, numbers: phoneNumbers } });
    }

    for (const number of numbers) {
      // Simulate random delay between 2-6 seconds
      const delay = Math.floor(Math.random() * (6000 - 2000 + 1)) + 2000;
      await new Promise(resolve => setTimeout(resolve, delay));

      try {
        // Here, instead of passing pictureUrl, you would likely need to
        // upload the selectedFile to a server and get a URL back.
        // For this example, I'm just passing a placeholder.
        const result = await sendMessage(number, messageTemplate, 'https://picsum.photos/200/300');
        newResults.push(result);
      } catch (error) {
        console.error(`Failed to send message to ${number}:`, error);
        newResults.push({ phoneNumber: number, status: 'failed' });
      }
    }

    setResults(newResults);
  };

  return (
    <div className="container mx-auto p-4 space-y-4">
      <h1 className="text-2xl font-bold">ZaloPilot</h1>

      <Card>
        <CardHeader>
          <h2>Phone Numbers</h2>
        </CardHeader>
        <CardContent>
          <Textarea
            placeholder="Enter phone numbers, separated by commas"
            value={phoneNumbers}
            onChange={(e) => setPhoneNumbers(e.target.value)}
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <h2>Message Template</h2>
        </CardHeader>
        <CardContent>
          <Textarea
            placeholder="Enter your message template"
            value={messageTemplate}
            onChange={(e) => setMessageTemplate(e.target.value)}
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <h2>Picture Upload</h2>
        </CardHeader>
        <CardContent>
          <Input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
          />
          {selectedFile && (
            <div className="mt-2">
              <p>Selected File: {selectedFile.name}</p>
            </div>
          )}
        </CardContent>
      </Card>

      <Button onClick={handleSendToAll} className="bg-accent text-accent-foreground hover:bg-teal-700">
        Send to All
      </Button>

      {results.length > 0 && (
        <Card>
          <CardHeader>
            <h2>Status</h2>
          </CardHeader>
          <CardContent>
            <StatusDisplay results={results} />
          </CardContent>
        </Card>
      )}
    </div>
  );
}
