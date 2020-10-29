import updateBounds from '../../components/Globe/updateBounds';

export default ({ target }) => {
  // Update red "field of view" box in Globe
  updateBounds(target.getBounds());
};
