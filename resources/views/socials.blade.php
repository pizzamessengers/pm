@extends('layouts.app')

@section('content')
  <div id="root"></div>
  <script>
    let apiToken = @json($apiToken),
        socials = @json($socials);
  </script>
@endsection
