"use client";

import * as React from "react";
import { AppShell } from "@/components/layout/app-shell";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  ChevronLeft,
  ChevronRight,
  RotateCcw,
  Shuffle,
  Check,
  X,
} from "lucide-react";
import { products } from "@/data/products";

// Sample objections for practice
const practiceObjections = [
  {
    id: "1",
    productId: "freedom",
    objection: "It's too expensive.",
    response:
      "I understand cost is a consideration. What are you currently spending on pain solutions? When you factor in effectiveness and being completely drug-free with no side effects, most people find it's quite economical.",
    psychology:
      "Validates concern, then shifts focus to value and total cost comparison.",
  },
  {
    id: "2",
    productId: "freedom",
    objection: "Does it really work?",
    response:
      "I appreciate your skepticism. Yes, it works, and we have the RESTORE clinical study published in Pain Therapeutics to back it up. Would you like to try it risk-free?",
    psychology:
      "Compliments skepticism, provides clinical evidence, offers risk-free trial.",
  },
  {
    id: "3",
    productId: "rem",
    objection: "I've tried everything for sleep.",
    response:
      "I hear that a lot. The difference is, this isn't a pill or supplement—it's a completely different technology. In the HARMONI study, 80% of participants stopped their sleep medications. What have you tried that didn't work?",
    psychology:
      "Differentiates the product, uses clinical data, opens discovery.",
  },
  {
    id: "4",
    productId: "all",
    objection: "I need to think about it.",
    response:
      "Absolutely, it's an important decision. What specific questions do you want to think through? I'd love to address them now so you have all the information you need.",
    psychology: "Respects their process while uncovering hidden objections.",
  },
  {
    id: "5",
    productId: "all",
    objection: "Let me talk to my spouse first.",
    response:
      "That makes sense—it's great that you make decisions together. Would it help if I sent you some information you could share with them? Or better yet, is there a time we could all connect briefly?",
    psychology: "Validates family decision-making, offers to facilitate.",
  },
];

export default function PracticePage() {
  const [currentIndex, setCurrentIndex] = React.useState(0);
  const [isFlipped, setIsFlipped] = React.useState(false);
  const [shuffled, setShuffled] = React.useState(practiceObjections);
  const [score, setScore] = React.useState({ correct: 0, incorrect: 0 });

  const currentCard = shuffled[currentIndex];
  const progress = ((currentIndex + 1) / shuffled.length) * 100;
  const product = products.find((p) => p.id === currentCard.productId);

  const handleNext = () => {
    if (currentIndex < shuffled.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setIsFlipped(false);
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      setIsFlipped(false);
    }
  };

  const handleShuffle = () => {
    const newShuffled = [...shuffled].sort(() => Math.random() - 0.5);
    setShuffled(newShuffled);
    setCurrentIndex(0);
    setIsFlipped(false);
    setScore({ correct: 0, incorrect: 0 });
  };

  const handleReset = () => {
    setShuffled(practiceObjections);
    setCurrentIndex(0);
    setIsFlipped(false);
    setScore({ correct: 0, incorrect: 0 });
  };

  const handleMark = (correct: boolean) => {
    if (correct) {
      setScore((prev) => ({ ...prev, correct: prev.correct + 1 }));
    } else {
      setScore((prev) => ({ ...prev, incorrect: prev.incorrect + 1 }));
    }
    handleNext();
  };

  return (
    <AppShell>
      <div className="flex flex-col gap-6 p-6 md:p-8 max-w-3xl mx-auto">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-3xl md:text-4xl font-black uppercase tracking-tight">
            Practice Mode
          </h1>
          <p className="text-muted-foreground mt-1">
            Master objection handling with flashcards
          </p>
        </div>

        {/* Progress */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>
              Card {currentIndex + 1} of {shuffled.length}
            </span>
            <span className="flex gap-4">
              <span className="text-green-600">✓ {score.correct}</span>
              <span className="text-red-600">✗ {score.incorrect}</span>
            </span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        {/* Flashcard */}
        <div
          className="relative h-[400px] cursor-pointer perspective-1000"
          onClick={() => setIsFlipped(!isFlipped)}
        >
          <div
            className={`relative w-full h-full transition-transform duration-500 transform-style-preserve-3d ${
              isFlipped ? "rotate-y-180" : ""
            }`}
            style={{
              transformStyle: "preserve-3d",
              transform: isFlipped ? "rotateY(180deg)" : "rotateY(0deg)",
            }}
          >
            {/* Front - Objection */}
            <Card
              className="absolute inset-0 backface-hidden flex flex-col"
              style={{ backfaceVisibility: "hidden" }}
            >
              <CardContent className="flex-1 flex flex-col items-center justify-center p-8 text-center">
                <div className="mb-4">
                  {product ? (
                    <Badge
                      style={{ backgroundColor: product.color, color: "white" }}
                    >
                      {product.emoji} {product.name}
                    </Badge>
                  ) : (
                    <Badge variant="secondary">All Products</Badge>
                  )}
                </div>
                <p className="text-sm text-muted-foreground mb-4">
                  OBJECTION:
                </p>
                <p className="text-2xl font-bold">
                  "{currentCard.objection}"
                </p>
                <p className="text-sm text-muted-foreground mt-8">
                  Tap to reveal response
                </p>
              </CardContent>
            </Card>

            {/* Back - Response */}
            <Card
              className="absolute inset-0 backface-hidden flex flex-col"
              style={{
                backfaceVisibility: "hidden",
                transform: "rotateY(180deg)",
              }}
            >
              <CardContent className="flex-1 flex flex-col p-8 overflow-auto">
                <p className="text-sm text-muted-foreground mb-2">RESPONSE:</p>
                <p className="text-lg mb-6">"{currentCard.response}"</p>
                <div className="mt-auto pt-4 border-t">
                  <p className="text-sm text-muted-foreground mb-1">
                    💡 Psychology:
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {currentCard.psychology}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-between">
          <Button
            variant="outline"
            onClick={handlePrevious}
            disabled={currentIndex === 0}
          >
            <ChevronLeft className="h-4 w-4 mr-2" />
            Previous
          </Button>

          <div className="flex gap-2">
            <Button variant="outline" size="icon" onClick={handleShuffle}>
              <Shuffle className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon" onClick={handleReset}>
              <RotateCcw className="h-4 w-4" />
            </Button>
          </div>

          <Button
            variant="outline"
            onClick={handleNext}
            disabled={currentIndex === shuffled.length - 1}
          >
            Next
            <ChevronRight className="h-4 w-4 ml-2" />
          </Button>
        </div>

        {/* Self-Assessment */}
        {isFlipped && (
          <div className="flex justify-center gap-4">
            <Button
              variant="outline"
              className="border-red-200 hover:bg-red-50"
              onClick={() => handleMark(false)}
            >
              <X className="h-4 w-4 mr-2 text-red-600" />
              Need Practice
            </Button>
            <Button
              variant="outline"
              className="border-green-200 hover:bg-green-50"
              onClick={() => handleMark(true)}
            >
              <Check className="h-4 w-4 mr-2 text-green-600" />
              Got It!
            </Button>
          </div>
        )}

        {/* Tips */}
        <Card className="bg-muted/50">
          <CardContent className="py-4 text-center text-sm text-muted-foreground">
            <p>
              💡 <strong>Tip:</strong> Practice saying the response out loud
              before revealing the answer. This helps build muscle memory for
              real conversations.
            </p>
          </CardContent>
        </Card>
      </div>
    </AppShell>
  );
}

