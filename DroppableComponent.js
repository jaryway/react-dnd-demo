import { useDrop } from 'react-dnd'

function DroppableComponent(props) {
  const [collectedProps, drop] = useDrop({
    accept,
  })

  return <div ref={drop}>Drop Target</div>
}