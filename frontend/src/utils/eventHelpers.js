// Helper to provide an image for events that have an empty or missing imageUrl
export const getEventImage = (event) => {
  if (event?.imageUrl && typeof event.imageUrl === 'string' && event.imageUrl.trim().length > 5) {
    return event.imageUrl.trim()
  }

  const category = (event?.category || '').toLowerCase()
  const title = (event?.title || '').toLowerCase()

  if (category.includes('tech') || title.includes('ai') || title.includes('intelligence')) {
    return 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&auto=format&fit=crop&q=80'
  }
  if (category.includes('workshop') || title.includes('web') || title.includes('developer') || title.includes('full stack')) {
    return 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&auto=format&fit=crop&q=80'
  }
  if (category.includes('music') || title.includes('music') || title.includes('concert')) {
    return 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=800&auto=format&fit=crop&q=80'
  }
  if (category.includes('sport') || title.includes('cricket') || title.includes('football')) {
    return 'https://images.unsplash.com/photo-1531415074868-036b107e775a?w=800&auto=format&fit=crop&q=80'
  }
  if (category.includes('food') || title.includes('food') || title.includes('culinary')) {
    return 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&auto=format&fit=crop&q=80'
  }
  if (category.includes('wedding')) {
    return 'https://images.unsplash.com/photo-1519741497674-611481863552?w=800&auto=format&fit=crop&q=80'
  }
  if (category.includes('health') || category.includes('yoga')) {
    return 'https://images.unsplash.com/photo-1545205597-3d9d02c29597?w=800&auto=format&fit=crop&q=80'
  }
  return 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&auto=format&fit=crop&q=80'
}

export const formatEventDate = (dateString) => {
  if (!dateString) return 'Date to be announced'
  const date = new Date(dateString)
  if (Number.isNaN(date.getTime())) return dateString

  return date.toLocaleDateString('en-IN', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    hour: 'numeric',
    minute: '2-digit',
  })
}

