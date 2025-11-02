import { useEffect, useRef, useState } from 'react';
import { useAuthContext } from '../../context/auth';
import { useMyNextClassesContext, useBookingDetailContext } from '../../context/booking';
import BookingView from '../../components/shared/BookingView';

export default function MyNextBooking() {
  const { user } = useAuthContext();
  const { loading, error, classes, fetchMyNextClasses } = useMyNextClassesContext();
  const { loading: detailLoading, error: detailError, bookingDetail, fetchBookingDetail } = useBookingDetailContext();
  const hasFetched = useRef(false);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    if (!hasFetched.current) {
      hasFetched.current = true;
      fetchMyNextClasses();
    }
  }, []);

  const handleCardClick = async (bookingId: number) => {
    setModalOpen(true);
    await fetchBookingDetail(bookingId);
  };

  const handleModalClose = () => {
    setModalOpen(false);
  };

  return (
    <BookingView 
      user={user} 
      loading={loading} 
      error={error} 
      classes={classes}
      onCardClick={handleCardClick}
      modalOpen={modalOpen}
      onModalClose={handleModalClose}
      bookingDetail={bookingDetail}
      detailLoading={detailLoading}
      detailError={detailError}
    />
  );
}
