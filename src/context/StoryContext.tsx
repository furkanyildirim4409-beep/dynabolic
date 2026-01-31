import { createContext, useContext, useState, ReactNode, useCallback } from "react";

export interface Story {
  id: string;
  title: string;
  thumbnail: string;
  content: {
    image: string;
    text: string;
  };
}

interface StoryContextValue {
  isOpen: boolean;
  stories: Story[];
  initialIndex: number;
  categoryLabel?: string;
  categoryIcon?: ReactNode;
  categoryGradient?: string;
  onComplete?: () => void; // YENİ EKLENDİ
  openStories: (
    stories: Story[],
    initialIndex?: number,
    options?: {
      categoryLabel?: string;
      categoryIcon?: ReactNode;
      categoryGradient?: string;
      onComplete?: () => void; // YENİ EKLENDİ
    },
  ) => void;
  closeStories: () => void;
}

const StoryContext = createContext<StoryContextValue | null>(null);

interface StoryProviderProps {
  children: ReactNode;
}

export const StoryProvider = ({ children }: StoryProviderProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [stories, setStories] = useState<Story[]>([]);
  const [initialIndex, setInitialIndex] = useState(0);
  const [categoryLabel, setCategoryLabel] = useState<string>();
  const [categoryIcon, setCategoryIcon] = useState<ReactNode>();
  const [categoryGradient, setCategoryGradient] = useState<string>();
  const [onComplete, setOnComplete] = useState<(() => void) | undefined>(); // YENİ STATE

  const openStories = useCallback(
    (
      newStories: Story[],
      newInitialIndex = 0,
      options?: {
        categoryLabel?: string;
        categoryIcon?: ReactNode;
        categoryGradient?: string;
        onComplete?: () => void;
      },
    ) => {
      if (newStories.length === 0) return;

      setStories(newStories);
      setInitialIndex(newInitialIndex);
      setCategoryLabel(options?.categoryLabel);
      setCategoryIcon(options?.categoryIcon);
      setCategoryGradient(options?.categoryGradient);
      setOnComplete(() => options?.onComplete); // Callback'i kaydet
      setIsOpen(true);
    },
    [],
  );

  const closeStories = useCallback(() => {
    setIsOpen(false);
    // Animasyon sonrası state'i sıfırla
    setTimeout(() => {
      setStories([]);
      setInitialIndex(0);
      setCategoryLabel(undefined);
      setCategoryIcon(undefined);
      setCategoryGradient(undefined);
      setOnComplete(undefined);
    }, 300);
  }, []);

  return (
    <StoryContext.Provider
      value={{
        isOpen,
        stories,
        initialIndex,
        categoryLabel,
        categoryIcon,
        categoryGradient,
        onComplete,
        openStories,
        closeStories,
      }}
    >
      {children}
    </StoryContext.Provider>
  );
};

export const useStory = () => {
  const context = useContext(StoryContext);
  if (!context) {
    throw new Error("useStory must be used within a StoryProvider");
  }
  return context;
};
