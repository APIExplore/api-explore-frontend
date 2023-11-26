import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { backendDomain } from '../../constants/apiConstants';

interface ApiCall {
  date: string;
  duration: number;
  endpoint: string;
  method: string;
  requestBody: any;
  response: {
    date: string;
    data: any[];
    status: number;
  };
  operationId: string;
  parameters: Array<{
    in: string;
    name: string;
    type: string;
    value: string;
  }>;
  sequenceId: string;
}

interface CallSequence {
  name: string;
  sequenceId: string;
  favorite: boolean;
  details?: ApiCall[];
  expanded?: boolean;
  selectedApiCall?: ApiCall | null;
}

export default function CallSequences() {
  const [callSequences, setCallSequences] = useState<CallSequence[]>([]);
  const [showMore, setShowMore] = useState(false);
  const [showFavorites, setShowFavorites] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchCallSequences() {
      try {
        const response = await axios.get(`${backendDomain}/callsequence/fetch`);
        const sequencesFromApi: CallSequence[] = response.data.map((seq: any) => ({
          ...seq,
          favorite: false,
          details: [],
          expanded: false,
          selectedApiCall: null,
        }));

        setCallSequences(sequencesFromApi);
        setLoading(false);
      } catch (error: any) {
        console.error('Error fetching call sequences:', error.response?.data?.error || 'Unknown error');
        setLoading(false);
      }
    }

    fetchCallSequences();
  }, []);

  const toggleFavorite = async (sequenceName: string) => {
    setCallSequences((prevSequences) =>
      prevSequences.map((seq) =>
        seq.name === sequenceName ? { ...seq, favorite: !seq.favorite } : seq
      )
    );
  };

  const toggleDetails = async (sequenceName: string) => {
    const sequence = callSequences.find((seq) => seq.name === sequenceName);

    if (sequence && !sequence.details?.length) {
      try {
        const response = await axios.get(`${backendDomain}/callsequence/fetch/${sequenceName}`);
        const details = response.data;
        setCallSequences((prevSequences) =>
          prevSequences.map((seq) =>
            seq.name === sequenceName ? { ...seq, details } : seq
          )
        );
      } catch (error: any) {
        console.error('Error fetching call sequence details:', error.response?.data?.error || 'Unknown error');
      }
    }

    setCallSequences((prevSequences) =>
      prevSequences.map((seq) =>
        seq.name === sequenceName ? { ...seq, expanded: !seq.expanded, selectedApiCall: null } : seq
      )
    );
  };

  const selectApiCall = (sequenceName: string, apiCall: ApiCall | null) => {
    setCallSequences((prevSequences) =>
      prevSequences.map((seq) =>
        seq.name === sequenceName ? { ...seq, selectedApiCall: apiCall } : seq
      )
    );
  };

  const hideSelectedApiCall = (sequenceName: string) => {
    setCallSequences((prevSequences) =>
      prevSequences.map((seq) =>
        seq.name === sequenceName ? { ...seq, selectedApiCall: null } : seq
      )
    );
  };

  const showOnlyFavorites = () => {
    setShowFavorites(!showFavorites);
  };

  const filteredSequences = showFavorites
    ? callSequences.filter((sequence) => sequence.favorite)
    : callSequences;

  return (
    <div className="p-4" style={{
      maxHeight: '500px',
      overflowY: 'auto',
    }}>
      <h2 className="text-xl font-semibold mb-4">Call Sequences</h2>
      <div className="mb-4">
        <button
          onClick={showOnlyFavorites}
          className={`p-2 bg-${showFavorites ? 'green' : 'gray'}-500 text-white rounded hover:bg-${showFavorites ? 'green' : 'gray'}-600`}
        >
          {showFavorites ? 'Show All' : 'Show Favorites Only'}
        </button>
      </div>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <ul className="space-y-4">
          {filteredSequences.slice(0, showMore ? filteredSequences.length : 3).map((sequence, index) => (
            <li key={index} className="border p-4">
              <div className="flex items-center justify-between">
                <span className="text-lg font-semibold">{sequence.name}</span>
                <button
                  onClick={() => toggleFavorite(sequence.name)}
                  className={`text-yellow-500 ${sequence.favorite ? 'opacity-100' : 'opacity-50'}`}
                >
                  ⭐ Star
                </button>
              </div>
              <button
                onClick={() => toggleDetails(sequence.name)}
                className="text-blue-500 hover:underline mt-2"
              >
                {sequence.expanded ? 'Collapse Details' : 'Expand Details'}
              </button>
              {sequence.expanded && (
                <div className="mt-2">
                  <h3 className="text-lg font-semibold">Details:</h3>
                  <ul className="list-disc pl-6 mt-2">
                    {sequence.details?.map((apiCall, apiIndex) => (
                      <li key={apiIndex} className="mb-2">
                        <button
                          className={`text-blue-500 hover:underline mr-2 ${sequence.selectedApiCall === apiCall ? 'font-bold' : ''}`}
                          onClick={() => selectApiCall(sequence.name, apiCall)}
                        >
                          {apiCall.method} - {apiCall.endpoint}
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {sequence.selectedApiCall && (
                <div className="mt-2">
                  <button
                  className="text-red-500 hover:underline"
                  onClick={() => hideSelectedApiCall(sequence.name)}
                >
                  Clear
                </button>
                  <h3 className="text-lg font-semibold">Selected API Call:</h3>
                  <pre className="bg-gray-100 p-2 overflow-auto whitespace-pre-line" style={{
                    display: 'table',
                    tableLayout: 'fixed',
                    width: '100%',
                  }}>
                    {JSON.stringify(sequence.selectedApiCall, null, 2)}
                  </pre>
                  <button
                    className="text-blue-500 hover:underline mt-2"
                    onClick={() => hideSelectedApiCall(sequence.name)}
                  >
                    Collapse Details
                  </button>
                </div>
              )}
            </li>
          ))}
        </ul>
      )}
      {filteredSequences.length > 3 && (
        <button
          onClick={() => setShowMore(!showMore)}
          className="mt-4 p-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          {showMore ? 'Show Less' : 'Show More'}
        </button>
      )}
    </div>
  );
}
