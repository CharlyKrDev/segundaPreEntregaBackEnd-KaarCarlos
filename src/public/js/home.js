document.addEventListener('DOMContentLoaded', function() {
  const limitSelect = document.getElementById('limitSelect');
  const sortSelect = document.getElementById('sort');

  // Restaurar valores seleccionados de localStorage
  const savedLimit = localStorage.getItem('selectedLimit');
  const savedSort = localStorage.getItem('selectedSort');

  if (savedLimit) {
    limitSelect.value = savedLimit;
  }
  if (savedSort) {
    sortSelect.value = savedSort;
  }

  // Actualizar URL y guardar en localStorage al cambiar el límite
  limitSelect.addEventListener('change', function() {
    const limit = this.value;
    const sort = sortSelect.value;

    localStorage.setItem('selectedLimit', limit);
    updateUrl(limit, sort);
  });

  // Actualizar URL y guardar en localStorage al cambiar el orden
  sortSelect.addEventListener('change', function() {
    const sort = this.value;
    const limit = limitSelect.value;

    localStorage.setItem('selectedSort', sort);
    updateUrl(limit, sort);
  });

  // Función para actualizar la URL
  function updateUrl(limit, sort) {
    const url = new URL(window.location.href);
    url.searchParams.set('limit', limit);
    if (sort) {
      url.searchParams.set('sort', sort);
    } else {
      url.searchParams.delete('sort');
    }
    window.location.href = url.toString();
  }
});
