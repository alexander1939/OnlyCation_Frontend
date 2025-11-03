import { useEffect, useRef, useState } from 'react';
import { useAuthContext } from '../../context/auth';
import { useAllClassesContext, useBookingDetailContext } from '../../context/booking';
import AllBookingsView from '../../components/shared/AllBookingsView';

export default function AllBookings() {
  const { user } = useAuthContext();
  const { loading, error, classes, hasMore, fetchAllClasses, loadMoreClasses } = useAllClassesContext();
  const { loading: detailLoading, error: detailError, bookingDetail, fetchBookingDetail } = useBookingDetailContext();
  const hasFetched = useRef(false);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    if (!hasFetched.current) {
      hasFetched.current = true;
      fetchAllClasses();
    }
  }, []);

  const handleCardClick = async (bookingId: number) => {
    setModalOpen(true);
    await fetchBookingDetail(bookingId);
  };

  const handleModalClose = () => {
    setModalOpen(false);
  };

  const handleLoadMore = () => {
    loadMoreClasses();
  };

  const handleSearch = (params: { status?: string; date_from?: string; min_price?: number }) => {
    fetchAllClasses(params);
  };

  return (
    <AllBookingsView 
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
      hasMore={hasMore}
      onLoadMore={handleLoadMore}
      onSearch={handleSearch}
      pageTitle="Mis Reservas"
      showViewAllButton={false}
    />
  );
}
