import { useAuthContext } from '../../context/auth';
import BookingView from '../../components/shared/BookingView';

export default function MyNextBooking() {
  const { user } = useAuthContext();
  return <BookingView user={user} />;
}
