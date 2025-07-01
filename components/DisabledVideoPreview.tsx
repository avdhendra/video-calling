import {
  DefaultVideoPlaceholder,
  StreamVideoParticipant,
  useConnectedUser,
} from '@stream-io/video-react-sdk';


export const DisabledVideoPreview = () => {
 const connectedUser = useConnectedUser();
  if (!connectedUser) return null;

  return (
    <DefaultVideoPlaceholder
      participant={{
          image: connectedUser.image,
          name: connectedUser.name,
        } as StreamVideoParticipant}
    />
  );
};
