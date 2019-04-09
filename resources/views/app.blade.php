@extends('layouts.application')

@section('content')
  <div id="root"></div>
  <script>
    let apiToken  = @json($apiToken),
        lang      = @json($lang),
        userName  = @json($userName),
        socials   = @json($socials);
  </script>
@endsection
