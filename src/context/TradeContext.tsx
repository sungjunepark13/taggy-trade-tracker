import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { useBrokerageAccounts } from './BrokerageAccountsContext';

// Types
export type TradeType = 'BUY' | 'SELL';
export type TradeStatus = 'WIN' | 'LOSS' | 'BREAKEVEN';

export interface Tag {
  id: string;
  name: string;
  color: string;
}

export interface Trade {
  id: string;
  date: string;
  symbol: string;
  type: TradeType;
  entryPrice: number;
  exitPrice: number;
  quantity: number;
  status: TradeStatus;
  profit: number;
  notes: string;
  tags: string[];
  accountId: string; // Account ID field
}

interface TradeState {
  trades: Trade[];
  tags: Tag[];
  isLoading: boolean;
}

type TradeAction =
  | { type: 'ADD_TRADE'; payload: Trade }
  | { type: 'UPDATE_TRADE'; payload: Trade }
  | { type: 'DELETE_TRADE'; payload: string }
  | { type: 'ADD_TAG'; payload: Tag }
  | { type: 'DELETE_TAG'; payload: string }
  | { type: 'SET_TRADES'; payload: Trade[] }
  | { type: 'SET_TAGS'; payload: Tag[] };

const initialState: TradeState = {
  trades: [],
  tags: [
    { id: '1', name: 'Breakout', color: '#10B981' },
    { id: '2', name: 'Reversal', color: '#F59E0B' },
    { id: '3', name: 'Trend Following', color: '#3B82F6' },
    { id: '4', name: 'Swing', color: '#8B5CF6' },
    { id: '5', name: 'Scalp', color: '#EC4899' },
  ],
  isLoading: true
};

const tradeReducer = (state: TradeState, action: TradeAction): TradeState => {
  switch (action.type) {
    case 'ADD_TRADE':
      return {
        ...state,
        trades: [...state.trades, action.payload]
      };
    case 'UPDATE_TRADE':
      return {
        ...state,
        trades: state.trades.map(trade =>
          trade.id === action.payload.id ? action.payload : trade
        )
      };
    case 'DELETE_TRADE':
      return {
        ...state,
        trades: state.trades.filter(trade => trade.id !== action.payload)
      };
    case 'ADD_TAG':
      return {
        ...state,
        tags: [...state.tags, action.payload]
      };
    case 'DELETE_TAG':
      return {
        ...state,
        tags: state.tags.filter(tag => tag.id !== action.payload)
      };
    case 'SET_TRADES':
      return {
        ...state,
        trades: action.payload,
        isLoading: false
      };
    case 'SET_TAGS':
      return {
        ...state,
        tags: action.payload
      };
    default:
      return state;
  }
};

// Create context
interface TradeContextProps {
  state: TradeState;
  addTrade: (trade: Omit<Trade, 'id'>) => void;
  updateTrade: (trade: Trade) => void;
  deleteTrade: (id: string) => void;
  addTag: (tag: Omit<Tag, 'id'>) => void;
  deleteTag: (id: string) => void;
}

const TradeContext = createContext<TradeContextProps | undefined>(undefined);

// Sample data generator with properly varied dates (within the last week)
const generateSampleTradesForAccount = (accountId: string): Trade[] => {
  const today = new Date();
  
  return [
    {
      id: `${accountId}-1`,
      date: new Date(today.getTime() - 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 5 days ago
      symbol: 'AAPL',
      type: 'BUY',
      entryPrice: 170.5,
      exitPrice: 175.25,
      quantity: 10,
      status: 'WIN',
      profit: 47.5,
      notes: 'Strong breakout on earnings',
      tags: ['1', '3'],
      accountId
    },
    {
      id: `${accountId}-2`,
      date: new Date(today.getTime() - 4 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 4 days ago
      symbol: 'TSLA',
      type: 'SELL',
      entryPrice: 210.75,
      exitPrice: 205.3,
      quantity: 5,
      status: 'WIN',
      profit: 27.25,
      notes: 'Reversal at resistance',
      tags: ['2'],
      accountId
    },
    {
      id: `${accountId}-3`,
      date: new Date(today.getTime() - 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 3 days ago
      symbol: 'MSFT',
      type: 'BUY',
      entryPrice: 335.8,
      exitPrice: 332.4,
      quantity: 3,
      status: 'LOSS',
      profit: -10.2,
      notes: 'Failed breakout, cut losses',
      tags: ['1', '5'],
      accountId
    },
    {
      id: `${accountId}-4`,
      date: new Date(today.getTime() - 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 2 days ago
      symbol: 'AMZN',
      type: 'BUY',
      entryPrice: 142.3,
      exitPrice: 145.8,
      quantity: 8,
      status: 'WIN',
      profit: 28,
      notes: 'Trend continuation after pullback',
      tags: ['3', '4'],
      accountId
    },
    {
      id: `${accountId}-5`,
      date: new Date(today.getTime() - 1 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 1 day ago
      symbol: 'NVDA',
      type: 'BUY',
      entryPrice: 460.2,
      exitPrice: 477.8,
      quantity: 2,
      status: 'WIN',
      profit: 35.2,
      notes: 'Strong momentum, took profits at resistance',
      tags: ['3', '5'],
      accountId
    }
  ];
};

export const TradeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(tradeReducer, initialState);
  const { accounts } = useBrokerageAccounts();

  // Load data from localStorage on mount
  useEffect(() => {
    const storedTrades = localStorage.getItem('trades');
    const storedTags = localStorage.getItem('tags');
    
    if (storedTrades) {
      dispatch({ type: 'SET_TRADES', payload: JSON.parse(storedTrades) });
    } else {
      // Generate sample trades for each account
      let allSampleTrades: Trade[] = [];
      
      accounts.forEach(account => {
        const sampleTrades = generateSampleTradesForAccount(account.id);
        allSampleTrades = [...allSampleTrades, ...sampleTrades];
      });
      
      dispatch({ type: 'SET_TRADES', payload: allSampleTrades });
      localStorage.setItem('trades', JSON.stringify(allSampleTrades));
    }
    
    if (storedTags) {
      dispatch({ type: 'SET_TAGS', payload: JSON.parse(storedTags) });
    } else {
      localStorage.setItem('tags', JSON.stringify(initialState.tags));
    }
  }, [accounts]);

  // Save to localStorage when state changes
  useEffect(() => {
    if (!state.isLoading) {
      localStorage.setItem('trades', JSON.stringify(state.trades));
      localStorage.setItem('tags', JSON.stringify(state.tags));
    }
  }, [state.trades, state.tags, state.isLoading]);

  // Add a new trade
  const addTrade = (trade: Omit<Trade, 'id'>) => {
    const newTrade: Trade = {
      ...trade,
      id: Date.now().toString()
    };
    dispatch({ type: 'ADD_TRADE', payload: newTrade });
  };

  // Update an existing trade
  const updateTrade = (trade: Trade) => {
    dispatch({ type: 'UPDATE_TRADE', payload: trade });
  };

  // Delete a trade
  const deleteTrade = (id: string) => {
    dispatch({ type: 'DELETE_TRADE', payload: id });
  };

  // Add a new tag
  const addTag = (tag: Omit<Tag, 'id'>) => {
    const newTag: Tag = {
      ...tag,
      id: Date.now().toString()
    };
    dispatch({ type: 'ADD_TAG', payload: newTag });
  };

  // Delete a tag
  const deleteTag = (id: string) => {
    dispatch({ type: 'DELETE_TAG', payload: id });
  };

  return (
    <TradeContext.Provider
      value={{ state, addTrade, updateTrade, deleteTrade, addTag, deleteTag }}
    >
      {children}
    </TradeContext.Provider>
  );
};

// Custom hook to use the context
export const useTrades = () => {
  const context = useContext(TradeContext);
  if (!context) {
    throw new Error('useTrades must be used within a TradeProvider');
  }
  return context;
};
