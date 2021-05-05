import data from '../../MOCK_DATA.json'

export default (req, res) => {
  res.status(200).json(data)
}
