import { Swiper, SwiperSlide } from "swiper/react";
import { highlightedMarkerAtom, Marker, TripDetailed } from "@/store/atoms";
import { SafeImage } from "@/components/SafeImage";
import { useSetAtom } from "jotai";
import { lightboxIndexAtom } from "@/store/atoms";
import { Pagination } from "swiper/modules";
import { getMarkerUrlThumbnail } from "@/services/thumbnail";
import type { Swiper as SwiperType } from "swiper";

export function PhotoSwiper({ selectedTrip }: { selectedTrip: TripDetailed }) {
    const setLightboxIndex = useSetAtom(lightboxIndexAtom);
    const setHighlightedMarker = useSetAtom(highlightedMarkerAtom);


    const handlePhotoClick = (index: number) => {
        setLightboxIndex(index);
    };
    const handleSlideChange = (swiper: SwiperType) => {
        const activeIndex = swiper.activeIndex;
        const activePhoto = selectedTrip.markers[activeIndex];
        if (activePhoto) {
            setHighlightedMarker(activePhoto.markerId);
        }
    };

    return (
        <Swiper
            modules={[Pagination]}
            spaceBetween={10}
            slidesPerView={selectedTrip.markers.length > 1 ? 1.2 : 1}
            navigation={false}
            onSlideChange={handleSlideChange}
            className="h-full rounded-lg"
        >
            {selectedTrip.markers.map((marker: Marker, index: number) => (
                <SwiperSlide key={marker.markerId} className="relative">
                    <div
                        className="relative w-full h-64 cursor-pointer hover:opacity-90 transition-opacity"
                        onKeyDown={(e) => {
                            if (e.key === "Enter" || e.key === " ")
                                handlePhotoClick(index);
                        }}
                        onClick={() => handlePhotoClick(index)}
                    >
                        <SafeImage
                            src={getMarkerUrlThumbnail(marker, "500x500")}
                            alt={marker.title || "Marker photo"}
                            fill
                            className="object-cover rounded-lg"
                            sizes="(max-width: 640px) 100vw, 500px"
                        />
                    </div>
                    {marker.description && (
                        <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white p-3 rounded-b-lg">
                            <p className="text-sm">{marker.description}</p>
                        </div>
                    )}
                </SwiperSlide>
            ))}
        </Swiper>
    );
}