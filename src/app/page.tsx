"use client";

import { useState, useEffect } from 'react';
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Check, X } from 'lucide-react';
import { sendMessage, SendMessageResult } from "@/services/zalo";
import { Card, CardHeader, CardContent } from "@/components/ui/card";

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
  const [pictureUrl, setPictureUrl] = useState<string>('');
  const [results, setResults] = useState<SendMessageResult[]>([]);
  const [recentInputs, setRecentInputs] = useState<{ message: string; numbers: string } | null>(null);

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

  const handleSendToAll = async () => {
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
        const result = await sendMessage(number, messageTemplate, pictureUrl);
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
          <h2>Picture URL</h2>
        </CardHeader>
        <CardContent>
          <Input
            placeholder="Enter picture URL"
            value={pictureUrl}
            onChange={(e) => setPictureUrl(e.target.value)}
          />
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
