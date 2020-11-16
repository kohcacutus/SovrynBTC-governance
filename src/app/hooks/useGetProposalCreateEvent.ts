import { EventData } from 'web3-eth-contract';
import { Proposal, ProposalCreatedEvent } from 'types/Proposal';
import { network } from '../containers/BlockChainProvider/network';
import { useCallback, useEffect, useState } from 'react';

interface StateStatus {
  event: EventData;
  value: ProposalCreatedEvent;
  loading: boolean;
}

export function useGetProposalCreateEvent(proposal: Proposal) {
  const getEvent = useCallback(async () => {
    setState(prevState => ({ ...prevState, loading: true }));
    const events = await network.getPastEvents(
      'governorAlpha',
      'ProposalCreated',
      { id: proposal.id },
      proposal.startBlock - 1,
      proposal.endBlock,
    );
    if (events.length) {
      const event = events[0];
      return {
        value: event.returnValues,
        event: event,
        loading: false,
      };
    }
    return {
      event: null as any,
      value: null as any,
      loading: false,
    };
  }, [proposal]);

  const [state, setState] = useState<StateStatus>({
    event: null as any,
    value: null as any,
    loading: true,
  });

  useEffect(() => {
    if (proposal.id) {
      getEvent().then(setState);
    }
  }, [proposal, setState, getEvent]);

  return state;
}
