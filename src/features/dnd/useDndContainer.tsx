import {useEffect, useRef, useState} from "react";

export function useDndDropZone() {

  // для возврата слова в начальное положение, если оно не попало в storage
  const [isOutsideContainer, setIsOutsideContainer] = useState<boolean>(false);
  const dropZoneContainerRef = useRef<HTMLDivElement>(null);

  function catchDndContainerLeaving(this: Window, e: PointerEvent) {
    if (dropZoneContainerRef.current) {
      const rect = dropZoneContainerRef.current.getBoundingClientRect();
      if (
        e.clientX < rect.left ||
        e.clientX > rect.right ||
        e.clientY < rect.top ||
        e.clientY > rect.bottom
      ) {
        setIsOutsideContainer(true)
      } else {
        setIsOutsideContainer(false)
      }
    }
  }

  // отловить курсор вне drag контейнера
  useEffect(() => {
    window.addEventListener("pointermove", catchDndContainerLeaving);
    return () => window.removeEventListener("pointermove", catchDndContainerLeaving);
  }, [])

  return ({
    dropZoneContainerRef,
    isOutsideContainer,
  })
}
