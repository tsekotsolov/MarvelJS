import React from 'react'
import requester from '../../utils/requester'

const withScroll = (WrappedComponent) => {
  return class extends React.Component {
    constructor (props) {
      super(props)
      this.state = {
        itemsPerFetch: 20,
        offset: 0,
        totalItems: 0,
        scrolling: false,
        itemsArray: []
      }
    }

    handleScroll = ()=>{
   
        const {totalItems,itemsArray, scrolling} = this.state
        if(scrolling || itemsArray.length >= totalItems)  return
        const lastElementRendered = document.querySelector('div.wrapper > div:last-child')
        if(lastElementRendered){
          const lastElementRenderedOffset = lastElementRendered.offsetTop + lastElementRendered.clientHeight    
          const pageOffset = window.pageYOffset + window.innerHeight
          const bottomOffset = 25
          if(pageOffset>lastElementRenderedOffset-bottomOffset) {
            this.loadMore()
          }
        }
    }

    loadMore = ()=>{
        this.setState(prevState=>({
          offset: prevState.offset+prevState.itemsPerFetch,
          scrolling:true
        }),()=>{
          this.props.fetchData(this.state.offset).then((response)=>
        {
          this.setState({
            itemsArray:[...this.state.itemsArray,...response.data.results],
            offset:response.data.offset,
            scrolling:false
          })
        }
        )
        })
      }

    componentDidMount () {
        this.props.fetchData(this.state.offset).then((response)=>
        {
          this.setState({
            itemsArray:[...this.state.itemsArray,...response.data.results],
            offset:response.data.offset,
            totalItems:response.data.total,
            scrolling:false
          })
        }
        )
      window.addEventListener('scroll', this.handleScroll, true)
    }

    componentWillUnmount () {
      window.removeEventListener('scroll', this.handleScroll, true)
    }

    render () {
        
      return <WrappedComponent {...this.props} state={this.state}/>
    }
  }
}
export default withScroll
